"use client";

import { useRef, useState } from "react";

import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type Funcionario = {
  nome: string;
  setor: string;
  chegada?: string;
  saida?: string;
  obs?: string;
};
export default function Page() {

  const pdfRef = useRef<HTMLDivElement>(null);

  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [chegada, setChegada] = useState("");
  const [saida, setSaida] = useState("");
  const [obs, setObs] = useState("");

  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([]);

  function adicionarFuncionario() {

    if (!nome || !setor) return;

    const novoFuncionario: Funcionario = {
      nome,
      setor,
      chegada,
      saida,
      obs,
    };
  setFuncionarios((prev) => [...prev, novoFuncionario]);

    setNome("");
    setSetor("");
    setChegada("");
    setSaida("");
    setObs("");
  }

  function removerFuncionario(index: number) {

    setFuncionarios((current) =>
      current.filter((_, i) => i !== index)
    );
  }
  async function exportarPDF() {

    const elemento = pdfRef.current;

    if (!elemento) return;

    const canvas = await html2canvas(elemento);

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");

    const larguraPDF = 210;

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

    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-7xl mx-auto">

        {/* CABEÇALHO */}

        <div className="mb-10 text-center">

          <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-yellow-600 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Souza Lima
          </h1>

          <p className="text-zinc-400 mt-3 text-lg">
            Controle de Funcionários e Plantão
          </p>

        </div>

        <div className="grid lg:grid-cols-[400px_1fr] gap-6">

          {/* FORMULÁRIO */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-fit sticky top-6">

            <h2 className="text-2xl font-bold mb-6 text-yellow-400">
              Registrar Funcionário
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Nome do funcionário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-yellow-500"
              />
              <input
                type="text"
                placeholder="Setor"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-yellow-500"
              />

              <div className="grid grid-cols-2 gap-4">
                <input
                  type="time"
                  placeholder="Chegada"
                  value={chegada}
                  onChange={(e) => setChegada(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-yellow-500"
                />
                <input
                  type="time"
                  placeholder="Saída"
                  value={saida}
                  onChange={(e) => setSaida(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl p-3 outline-none focus:border-yellow-500"
                />
              </div>

              <textarea
                placeholder="Observações"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3 min-h-[120px] outline-none focus:border-yellow-500"
              />

              <button
                onClick={adicionarFuncionario}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold p-4 rounded-xl transition-all"
              >
                Adicionar à Tabela
              </button>

              <button
                onClick={exportarPDF}
                className="bg-white hover:bg-zinc-200 text-black font-bold p-4 rounded-xl transition-all"
              >
                Exportar PDF
              </button>

            </div>

          </div>

          {/* TABELA */}

          <div
            ref={pdfRef}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 overflow-hidden"
          >

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

              <div>
                <h2 className="text-3xl font-bold text-yellow-400">
                  Funcionários Registrados
                </h2>

                <p className="text-zinc-400 mt-1">
                  Controle operacional Souza Lima
                </p>
              </div>

              <div className="bg-yellow-500 text-black px-5 py-3 rounded-2xl font-black text-lg w-fit">
                {funcionarios.length} Registros
              </div>

            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800">

              <table className="w-full min-w-[900px] border-collapse">

                <thead>
                   <tr className="bg-yellow-500 text-black text-left">

                    <th className="p-4">Funcionário</th>
                    <th className="p-4">Setor</th>
                    <th className="p-4">Chegada</th>
                    <th className="p-4">Saída</th>
                    <th className="p-4">Observações</th>
                    <th className="p-4 text-center">Ações</th>

                  </tr>

                </thead>

                <tbody>

                  {funcionarios.length === 0 && (
                    <tr>
                      <td
                        colSpan={6}
                        className="text-center p-10 text-zinc-500 bg-black"
                      >
                        Nenhum funcionário registrado.
                      </td>
                    </tr>
                  )}

                  {funcionarios.map((funcionario, index) => (

                    <tr
                      key={index}
                      className="border-t border-zinc-800 bg-black hover:bg-zinc-950 transition-all"
                    >

                      <td className="p-4 font-bold text-yellow-400">
                        {funcionario.nome}
                      </td>

                      <td className="p-4 text-zinc-300">
                        {funcionario.setor}
                      </td>

                      <td className="p-4">
                        {funcionario.chegada || "--:--"}
                      </td>

                      <td className="p-4">
                        {funcionario.saida || "--:--"}
                      </td>

                      <td className="p-4 max-w-[300px] break-words text-zinc-300">
                        {funcionario.obs || "Sem observações"}
                      </td>
                        <td className="p-4 text-center">

                        <button
                          onClick={() => removerFuncionario(index)}
                          className="bg-red-600 hover:bg-red-500 px-4 py-2 rounded-xl font-semibold transition-all"
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

      </div>

    </main>
  );
}

