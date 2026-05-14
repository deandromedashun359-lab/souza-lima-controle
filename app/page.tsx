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

    setFuncionarios([novoFuncionario, ...funcionarios]);

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

    pdf.save("relatorio-plantao.pdf");
  }

  return (

    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-6xl mx-auto">

        {/* CABEÇALHO */}

        <div className="mb-10 text-center">

          <h1 className="text-5xl font-black bg-gradient-to-r from-yellow-500 via-yellow-300 to-yellow-600 bg-clip-text text-transparent">

            Souza Lima

          </h1>

          <p className="text-gray-400 mt-3 text-lg">
            Controle de Plantão Industrial
          </p>

        </div>

        <div className="grid lg:grid-cols-2 gap-6">

          {/* FORMULÁRIO */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Registrar Funcionário
            </h2>

            <div className="grid gap-4">

              <input
                type="text"
                placeholder="Nome do funcionário"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3"
              />

              <input
                type="text"
                placeholder="Setor"
                value={setor}
                onChange={(e) => setSetor(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="time"
                  value={chegada}
                  onChange={(e) => setChegada(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl p-3"
                />

                <input
                  type="time"
                  value={saida}
                  onChange={(e) => setSaida(e.target.value)}
                  className="bg-black border border-zinc-700 rounded-xl p-3"
                />

              </div>

              <textarea
                placeholder="Observações"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                className="bg-black border border-zinc-700 rounded-xl p-3 min-h-[120px]"
              />

              <button
                onClick={adicionarFuncionario}
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-bold p-4 rounded-xl transition"
              >
                Adicionar Funcionário
              </button>

              <button
                onClick={exportarPDF}
                className="bg-white text-black font-bold p-4 rounded-xl"
              >
                Exportar PDF
              </button>

            </div>

          </div>

          {/* HISTÓRICO */}

          <div
            ref={pdfRef}
            className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6"
          >

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-2xl font-bold">
                Histórico
              </h2>

              <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
                {funcionarios.length}
              </span>

            </div>

            <div className="space-y-4">

              {funcionarios.length === 0 && (

                <div className="text-center border border-dashed border-zinc-700 rounded-2xl p-8 text-zinc-500">

                  Nenhum funcionário registrado

                </div>

              )}

              {funcionarios.map((funcionario, index) => (

                <div
                  key={index}
                  className="bg-black border border-zinc-800 rounded-2xl p-5"
                >

                  <div className="flex justify-between items-start mb-4">

                    <div>

                      <h3 className="text-xl font-bold text-yellow-400">

                        {funcionario.nome}

                      </h3>

                      <p className="text-zinc-400">

                        {funcionario.setor}

                      </p>

                    </div>

                    <button
                      onClick={() => removerFuncionario(index)}
                      className="bg-red-600 px-3 py-2 rounded-lg"
                    >
                      Remover
                    </button>

                  </div>

                  <div className="grid grid-cols-2 gap-4">

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">

                      <p className="text-zinc-400 text-sm">
                        Chegada
                      </p>

                      <p className="font-bold text-lg">
                        {funcionario.chegada || "--:--"}
                      </p>

                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-3">

                      <p className="text-zinc-400 text-sm">
                        Saída
                      </p>

                      <p className="font-bold text-lg">
                        {funcionario.saida || "--:--"}
                      </p>

                    </div>

                  </div>

                  {funcionario.obs && (

                    <div className="mt-4 bg-zinc-900 border border-zinc-800 rounded-xl p-4">

                      <p className="text-zinc-400 mb-2">
                        Observações
                      </p>

                      <p>
                        {funcionario.obs}
                      </p>

                    </div>

                  )}

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </main>
  );
}