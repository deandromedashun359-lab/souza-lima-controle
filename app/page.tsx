"use client";

import { useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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

  const dataAtual = new Date()
    .toISOString()
    .split("T")[0];

  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>([]);

  const [formulario, setFormulario] =
    useState<Funcionario>({
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
    if (
      !formulario.nome.trim() ||
      !formulario.setor.trim()
    ) {
      alert(
        "Preencha nome e setor."
      );
      return;
    }

    setFuncionarios((prev) => [
      ...prev,
      formulario,
    ]);

    setFormulario({
      nome: "",
      setor: "",
      data: dataAtual,
      chegada: "",
      saida: "",
      obs: "",
    });
  }

  function removerFuncionario(
    index: number
  ) {
    setFuncionarios((prev) =>
      prev.filter((_, i) => i !== index)
    );
  }

  function atualizarFuncionario(
    index: number,
    campo: keyof Funcionario,
    valor: string
  ) {
    setFuncionarios((prev) =>
      prev.map((funcionario, i) => {
        if (i === index) {
          return {
            ...funcionario,
            [campo]: valor,
          };
        }

        return funcionario;
      })
    );
  }

  async function exportarPDF() {
    if (!pdfRef.current) return;

    try {
      (
        document.activeElement as HTMLElement
      )?.blur();

      const canvas =
        await html2canvas(
          pdfRef.current,
          {
            scale: 2,
            useCORS: true,
            backgroundColor:
              "#09090b",
            logging: false,
          }
        );

      const imagem =
        canvas.toDataURL(
          "image/png"
        );

      const pdf = new jsPDF({
        orientation:
          "landscape",
        unit: "mm",
        format: "a4",
      });

      const larguraPDF =
        pdf.internal.pageSize.getWidth();

      const alturaPDF =
        pdf.internal.pageSize.getHeight();

      const margem = 8;

      const larguraImagem =
        larguraPDF -
        margem * 2;

      const alturaImagem =
        (canvas.height *
          larguraImagem) /
        canvas.width;

      const posicaoY = margem;

      pdf.addImage(
        imagem,
        "PNG",
        margem,
        posicaoY,
        larguraImagem,
        alturaImagem
      );

      pdf.save(
        "relatorio-souza-lima.pdf"
      );
    } catch (error) {
      console.error(error);

      alert(
        "Erro ao exportar PDF."
      );
    }
  }

  return (
    <main className="min-h-screen bg-[#000000] text-white p-6">
      <div className="max-w-[1700px] mx-auto">

        {/* HEADER */}

        <div className="text-center mb-10">
          <h1 className="text-5xl font-black text-[#facc15]">
            Souza Lima
          </h1>

          <p className="text-[#a1a1aa] mt-3 text-lg">
            Controle de Funcionários
          </p>
        </div>

        <div className="grid xl:grid-cols-[380px_1fr] gap-6">

          {/* FORM */}

          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-6 h-fit sticky top-6">

            <h2 className="text-2xl font-bold text-[#facc15] mb-6">
              Registrar Funcionário
            </h2>

            <div className="grid gap-4">

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
                className="bg-black border border-[#3f3f46] rounded-xl p-3 text-sm outline-none"
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
                className="bg-black border border-[#3f3f46] rounded-xl p-3 text-sm outline-none"
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
                className="bg-black border border-[#3f3f46] rounded-xl p-3 text-sm outline-none"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="time"
                  value={
                    formulario.chegada
                  }
                  onChange={(e) =>
                    atualizarFormulario(
                      "chegada",
                      e.target.value
                    )
                  }
                  className="bg-black border border-[#3f3f46] rounded-xl p-3 text-sm outline-none"
                />

                <input
                  type="time"
                  value={
                    formulario.saida
                  }
                  onChange={(e) =>
                    atualizarFormulario(
                      "saida",
                      e.target.value
                    )
                  }
                  className="bg-black border border-[#3f3f46] rounded-xl p-3 text-sm outline-none"
                />

              </div>

              <textarea
                placeholder="Observações"
                value={formulario.obs}
                onChange={(e) =>
                  atualizarFormulario(
                    "obs",
                    e.target.value
                  )
                }
                className="bg-black border border-[#3f3f46] rounded-xl p-3 min-h-[120px] text-sm outline-none resize-none"
              />

              <button
                onClick={
                  adicionarFuncionario
                }
                className="bg-[#eab308] hover:bg-[#facc15] text-black font-bold p-4 rounded-xl transition-all"
              >
                Adicionar Funcionário
              </button>

              <button
                onClick={exportarPDF}
                className="bg-white hover:bg-[#d4d4d8] text-black font-bold p-4 rounded-xl transition-all"
              >
                Exportar PDF
              </button>

            </div>
          </div>

          {/* TABELA */}

          <div
            ref={pdfRef}
            className="bg-[#09090b] border border-[#27272a] rounded-3xl p-4 overflow-hidden"
          >

            <table className="w-full border-collapse table-fixed">

              <thead>

                <tr className="bg-[#eab308] text-black">

                  <th className="p-2 text-xs w-[15%] text-left">
                    Funcionário
                  </th>

                  <th className="p-2 text-xs w-[12%] text-left">
                    Setor
                  </th>

                  <th className="p-2 text-xs w-[12%] text-left">
                    Data
                  </th>

                  <th className="p-2 text-xs w-[10%] text-left">
                    Entrada
                  </th>

                  <th className="p-2 text-xs w-[10%] text-left">
                    Saída
                  </th>

                  <th className="p-2 text-xs w-[28%] text-left">
                    Observações
                  </th>

                  <th className="p-2 text-xs w-[13%] text-center">
                    Ações
                  </th>

                </tr>

              </thead>

              <tbody>

                {funcionarios.length ===
                  0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="text-center text-[#71717a] p-8 text-sm"
                    >
                      Nenhum funcionário registrado.
                    </td>
                  </tr>
                )}

                {funcionarios.map(
                  (
                    funcionario,
                    index
                  ) => (
                    <tr
                      key={index}
                      className="border-t border-[#27272a]"
                    >

                      <td className="p-2">
                        <input
                          type="text"
                          value={
                            funcionario.nome
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "nome",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-2 py-1 text-xs outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="text"
                          value={
                            funcionario.setor
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "setor",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-2 py-1 text-xs outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="date"
                          value={
                            funcionario.data
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "data",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-1 py-1 text-xs outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="time"
                          value={
                            funcionario.chegada
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "chegada",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-1 py-1 text-xs outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <input
                          type="time"
                          value={
                            funcionario.saida
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "saida",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-1 py-1 text-xs outline-none"
                        />
                      </td>

                      <td className="p-2">
                        <textarea
                          rows={2}
                          value={
                            funcionario.obs
                          }
                          onChange={(e) =>
                            atualizarFuncionario(
                              index,
                              "obs",
                              e.target
                                .value
                            )
                          }
                          className="w-full bg-[#18181b] border border-[#3f3f46] rounded-md px-2 py-1 text-xs outline-none resize-none"
                        />
                      </td>

                      <td className="p-2 text-center">
                        <button
                          onClick={() =>
                            removerFuncionario(
                              index
                            )
                          }
                          className="bg-red-600 hover:bg-red-500 px-3 py-2 rounded-lg text-xs font-bold"
                        >
                          Remover
                        </button>
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </div>
      </div>
    </main>
  );
}