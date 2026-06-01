"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useEffect, useRef, useState } from "react";

type Funcionario = {
  nome: string;
  setor: string;
  data: string;
  entrada: string;
  saida: string;
  observacao: string;
};

const STORAGE_KEY = "souza-lima-registros";

export default function Home() {
  const pdfRef = useRef<HTMLDivElement>(null);
  const hoje = new Date().toISOString().split("T")[0];

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);
  const [carregado, setCarregado] = useState(false);

  const [form, setForm] = useState<Funcionario>({
    nome: "",
    setor: "",
    data: hoje,
    entrada: "",
    saida: "",
    observacao: "",
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const dadosSalvos = localStorage.getItem(STORAGE_KEY);

      if (dadosSalvos) {
        setFuncionarios(JSON.parse(dadosSalvos));
      }

      setCarregado(true);
    }
  }, []);

  useEffect(() => {
    if (carregado && typeof window !== "undefined") {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(funcionarios)
      );
    }
  }, [funcionarios, carregado]);

  function atualizarCampo(
    campo: keyof Funcionario,
    valor: string
  ) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function adicionarFuncionario() {
    if (!form.nome || !form.setor) {
      alert("Preencha nome e setor");
      return;
    }

    setFuncionarios((prev) => [...prev, form]);

    setForm({
      nome: "",
      setor: "",
      data: hoje,
      entrada: "",
      saida: "",
      observacao: "",
    });
  }

  function removerFuncionario(index: number) {
    setFuncionarios((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function limparTudo() {
    if (confirm("Deseja apagar todos os registros?")) {
      setFuncionarios([]);

      if (typeof window !== "undefined") {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }

  async function exportarPDF() {
    if (!pdfRef.current) return;

    const canvas = await html2canvas(pdfRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#111111",
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    const larguraPDF = pdf.internal.pageSize.getWidth();
    const alturaPDF =
      (canvas.height * larguraPDF) / canvas.width;

    pdf.addImage(
      imgData,
      "PNG",
      0,
      0,
      larguraPDF,
      alturaPDF
    );

    pdf.save("relatorio-souza-lima.pdf");
  }

  if (!carregado) return null;

  return (
    <main style={mainStyle}>
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1 style={tituloStyle}>
          Controle Souza Lima
        </h1>

        <div style={gridStyle}>
          <div style={cardStyle}>
            <input
              placeholder="Nome"
              value={form.nome}
              onChange={(e) =>
                atualizarCampo("nome", e.target.value)
              }
              style={inputStyle}
            />

            <input
              placeholder="Setor"
              value={form.setor}
              onChange={(e) =>
                atualizarCampo("setor", e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="date"
              value={form.data}
              onChange={(e) =>
                atualizarCampo("data", e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="time"
              value={form.entrada}
              onChange={(e) =>
                atualizarCampo("entrada", e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="time"
              value={form.saida}
              onChange={(e) =>
                atualizarCampo("saida", e.target.value)
              }
              style={inputStyle}
            />

            <textarea
              placeholder="Observações"
              value={form.observacao}
              onChange={(e) =>
                atualizarCampo(
                  "observacao",
                  e.target.value
                )
              }
              style={{
                ...inputStyle,
                minHeight: "100px",
              }}
            />

            <button
              onClick={adicionarFuncionario}
              style={botaoAmarelo}
            >
              Adicionar
            </button>

            <button
              onClick={exportarPDF}
              style={botaoBranco}
            >
              Exportar PDF
            </button>

            <button
              onClick={limparTudo}
              style={botaoVermelho}
            >
              Limpar Tudo
            </button>
          </div>

          <div ref={pdfRef} style={tabelaContainer}>
            <table style={tableStyle}>
              <thead>
                <tr style={theadStyle}>
                  <th style={thStyle}>Nome</th>
                  <th style={thStyle}>Setor</th>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Entrada</th>
                  <th style={thStyle}>Saída</th>
                  <th style={thStyle}>Obs</th>
                  <th style={thStyle}>Ação</th>
                </tr>
              </thead>

              <tbody>
                {funcionarios.map((f, i) => (
                  <tr key={i}>
                    <td style={tdStyle}>{f.nome}</td>
                    <td style={tdStyle}>{f.setor}</td>
                    <td style={tdStyle}>{f.data}</td>
                    <td style={tdStyle}>{f.entrada}</td>
                    <td style={tdStyle}>{f.saida}</td>
                    <td style={tdStyle}>
                      {f.observacao}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          removerFuncionario(i)
                        }
                        style={botaoVermelhoMini}
                      >
                        Remover
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}

const mainStyle = {
  minHeight: "100vh",
  backgroundColor: "#000",
  color: "#fff",
  padding: "30px",
  fontFamily: "Arial",
};

const tituloStyle = {
  textAlign: "center" as const,
  color: "#facc15",
  fontSize: "36px",
  fontWeight: "bold" as const,
  marginBottom: "30px",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "1fr 2fr",
  gap: "24px",
};

const cardStyle = {
  backgroundColor: "#18181b",
  padding: "20px",
  borderRadius: "16px",
};

const tabelaContainer = {
  backgroundColor: "#111111",
  padding: "20px",
  borderRadius: "16px",
  overflowX: "auto" as const,
};

const tableStyle = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const theadStyle = {
  backgroundColor: "#facc15",
  color: "#000",
};

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#000",
  color: "#fff",
  border: "1px solid #3f3f46",
  borderRadius: "10px",
};

const thStyle = {
  padding: "12px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "12px",
  borderBottom: "1px solid #27272a",
};

const botaoAmarelo = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#facc15",
  color: "#000",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

const botaoBranco = {
  ...botaoAmarelo,
  backgroundColor: "#ffffff",
};

const botaoVermelho = {
  ...botaoAmarelo,
  backgroundColor: "#dc2626",
  color: "#fff",
};

const botaoVermelhoMini = {
  backgroundColor: "#dc2626",
  color: "#fff",
  border: "none",
  padding: "8px 12px",
  borderRadius: "8px",
  cursor: "pointer",
};