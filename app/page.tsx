"use client";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useRef, useState } from "react";

type Funcionario = {
  nome: string;
  setor: string;
  data: string;
  chegada: string;
  saida: string;
  obs: string;
};

export default function Page() {
  const pdfRef = useRef<HTMLDivElement>(null);

  const dataAtual = new Date().toISOString().split("T")[0];

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  const [formulario, setFormulario] = useState<Funcionario>({
    nome: "",
    setor: "",
    data: dataAtual,
    chegada: "",
    saida: "",
    obs: "",
  });

  function atualizarFormulario(
    campo: keyof Funcionario,
    valor: string
  ) {
    setFormulario((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  function adicionarFuncionario() {
    if (!formulario.nome.trim() || !formulario.setor.trim()) {
      alert("Preencha nome e setor.");
      return;
    }

    setFuncionarios((prev) => [...prev, formulario]);

    setFormulario({
      nome: "",
      setor: "",
      data: dataAtual,
      chegada: "",
      saida: "",
      obs: "",
    });
  }

  function removerFuncionario(index: number) {
    setFuncionarios((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  async function exportarPDF() {
    if (!pdfRef.current) return;

    try {
      const canvas = await html2canvas(pdfRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#09090b",
      });

      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();

      const imgHeight =
        (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(
        imgData,
        "PNG",
        0,
        0,
        pdfWidth,
        imgHeight
      );

      pdf.save("relatorio-souza-lima.pdf");
    } catch (error) {
      console.error(error);
      alert("Erro ao exportar PDF");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "32px",
      }}
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "32px",
          }}
        >
          <h1
            style={{
              fontSize: "42px",
              fontWeight: 900,
              color: "#facc15",
            }}
          >
            Souza Lima
          </h1>

          <p style={{ color: "#a1a1aa" }}>
            Controle de Funcionários
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "360px 1fr",
            gap: "24px",
          }}
        >
          {/* FORMULÁRIO */}

          <div
            style={{
              background: "#18181b",
              padding: "24px",
              borderRadius: "20px",
            }}
          >
            <h2
              style={{
                color: "#facc15",
                fontSize: "24px",
                marginBottom: "20px",
              }}
            >
              Registrar Funcionário
            </h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Nome"
                value={formulario.nome}
                onChange={(e) =>
                  atualizarFormulario(
                    "nome",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type="text"
                placeholder="Setor"
                value={formulario.setor}
                onChange={(e) =>
                  atualizarFormulario(
                    "setor",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type="date"
                value={formulario.data}
                onChange={(e) =>
                  atualizarFormulario(
                    "data",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type="time"
                value={formulario.chegada}
                onChange={(e) =>
                  atualizarFormulario(
                    "chegada",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <input
                type="time"
                value={formulario.saida}
                onChange={(e) =>
                  atualizarFormulario(
                    "saida",
                    e.target.value
                  )
                }
                style={inputStyle}
              />

              <textarea
                placeholder="Observações"
                value={formulario.obs}
                onChange={(e) =>
                  atualizarFormulario(
                    "obs",
                    e.target.value
                  )
                }
                style={{
                  ...inputStyle,
                  minHeight: "100px",
                  resize: "none",
                }}
              />

              <button
                onClick={adicionarFuncionario}
                style={botaoAmarelo}
              >
                Adicionar Funcionário
              </button>

              <button
                onClick={exportarPDF}
                style={botaoBranco}
              >
                Exportar PDF
              </button>
            </div>
          </div>

          {/* TABELA */}

          <div
            ref={pdfRef}
            style={{
              backgroundColor: "#09090b",
              borderRadius: "20px",
              padding: "20px",
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
                {funcionarios.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      style={{
                        textAlign: "center",
                        padding: "24px",
                        color: "#71717a",
                      }}
                    >
                      Nenhum funcionário registrado
                    </td>
                  </tr>
                )}

                {funcionarios.map((f, index) => (
                  <tr
                    key={index}
                    style={{
                      borderTop:
                        "1px solid #27272a",
                    }}
                  >
                    <td style={tdStyle}>{f.nome}</td>
                    <td style={tdStyle}>{f.setor}</td>
                    <td style={tdStyle}>{f.data}</td>
                    <td style={tdStyle}>{f.chegada}</td>
                    <td style={tdStyle}>{f.saida}</td>
                    <td style={tdStyle}>{f.obs}</td>
                    <td style={tdStyle}>
                      <button
                        onClick={() =>
                          removerFuncionario(
                            index
                          )
                        }
                        style={{
                          background:
                            "#dc2626",
                          color: "#fff",
                          border: "none",
                          padding:
                            "8px 12px",
                          borderRadius:
                            "8px",
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
  borderRadius: "10px",
  background: "#000000",
  color: "#ffffff",
  border: "1px solid #3f3f46",
};

const botaoAmarelo = {
  background: "#facc15",
  color: "#000",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  fontWeight: 700,
  cursor: "pointer",
};

const botaoBranco = {
  background: "#ffffff",
  color: "#000",
  border: "none",
  padding: "14px",
  borderRadius: "10px",
  fontWeight: 700,
  cursor: "pointer",
};

const thStyle = {
  padding: "12px",
  fontSize: "14px",
  textAlign: "left" as const,
};

const tdStyle = {
  padding: "12px",
  fontSize: "14px",
};
