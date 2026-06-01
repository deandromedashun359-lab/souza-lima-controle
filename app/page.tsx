"use client";

import { useEffect, useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>(() => {
    const dados = localStorage.getItem(STORAGE_KEY);
    return dados ? JSON.parse(dados) : [];
  });
  const [form, setForm] = useState<Funcionario>({
    nome: "",
    setor: "",
    data: hoje,
    entrada: "",
    saida: "",
    observacao: "",
  });

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(funcionarios)
    );
  }, [funcionarios]);

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
    const novaLista = [...funcionarios];
    novaLista.splice(index, 1);
    setFuncionarios(novaLista);
  }

  function limparTudo() {
    if (confirm("Deseja apagar todos os registros?")) {
      setFuncionarios([]);
      localStorage.removeItem(STORAGE_KEY);
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

    const larguraPDF =
      pdf.internal.pageSize.getWidth();

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

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        <h1
          style={{
            textAlign: "center",
            color: "#facc15",
            fontSize: "36px",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          Controle Souza Lima
        </h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2fr",
            gap: "24px",
          }}
        >
          <div
            style={{
              backgroundColor: "#18181b",
              padding: "20px",
              borderRadius: "16px",
            }}
          >
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
                atualizarCampo(
                  "entrada",
                  e.target.value
                )
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

          <div
            ref={pdfRef}
            style={{
              backgroundColor: "#111111",
              padding: "20px",
              borderRadius: "16px",
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#facc15",
                    color: "#000",
                  }}
                >
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
                        style={{
                          backgroundColor: "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding: "8px 12px",
                          borderRadius: "8px",
                          cursor: "pointer",
                        }}
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

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#000000",
  color: "#ffffff",
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
  width: "100%",
  padding: "12px",
  marginBottom: "12px",
  backgroundColor: "#ffffff",
  color: "#000",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};

const botaoVermelho = {
  width: "100%",
  padding: "12px",
  backgroundColor: "#dc2626",
  color: "#ffffff",
  border: "none",
  borderRadius: "10px",
  fontWeight: "bold" as const,
  cursor: "pointer",
};