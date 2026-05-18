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

  const [funcionarios, setFuncionarios] =
    useState<Funcionario[]>([]);

  const [nome, setNome] = useState("");
  const [setor, setSetor] = useState("");
  const [data, setData] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [chegada, setChegada] = useState("");
  const [saida, setSaida] = useState("");
  const [obs, setObs] = useState("");

  function adicionarFuncionario() {

    if (!nome || !setor) return;

    const novoFuncionario: Funcionario = {
      nome,
      setor,
      data,
      chegada,
      saida,
      obs,
    };

    setFuncionarios((prev) => [
      ...prev,
      novoFuncionario,
    ]);

    setNome("");
    setSetor("");
    setData(
      new Date().toISOString().split("T")[0]
    );
    setChegada("");
    setSaida("");
    setObs("");
  }

  function removerFuncionario(index: number) {

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

  const elemento = pdfRef.current;

  if (!elemento) return;

  const canvas = await html2canvas(elemento, {
    scale: 1,
    useCORS: true,
    backgroundColor: "#000000",
  });

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "a4",
  });

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgWidth = canvas.width;
  const imgHeight = canvas.height;

  const ratio = Math.min(
    pdfWidth / imgWidth,
    pdfHeight / imgHeight
  );

  const finalWidth = imgWidth * ratio;
  const finalHeight = imgHeight * ratio;

  const x = (pdfWidth - finalWidth) / 2;
  const y = 5;

  pdf.addImage(
    imgData,
    "PNG",
    x,
    y,
    finalWidth,
    finalHeight
  );

  pdf.save("relatorio-souza-lima.pdf");
}

  return (

    <main className="min-h-screen bg-black text-white p-6">

      <div className="max-w-[1800px] mx-auto">

        {/* CABEÇALHO */}

        <div className="mb-10 text-center">

          <h1 className="text-6xl font-black text-[#facc15]">
            Souza Lima
          </h1>

          <p className="text-[#a1a1aa] mt-3 text-xl">
            Controle de Funcionários e Plantão
          </p>

        </div>

        {/* GRID */}

        <div className="grid xl:grid-cols-[420px_1fr] gap-8">

          {/* FORMULÁRIO */}

          <div className="bg-[#18181b] border border-[#27272a] rounded-3xl p-8 h-fit sticky top-6">

            <h2 className="text-3xl font-bold text-[#facc15] mb-8">
              Registrar Funcionário
            </h2>

            <div className="grid gap-5">

              <input
                type="text"
                placeholder="Nome do funcionário"
                value={nome}
                onChange={(e) =>
                  setNome(e.target.value)
                }
                className="bg-black border border-[#3f3f46] rounded-2xl p-4 text-lg outline-none"
              />

              <input
                type="text"
                placeholder="Setor"
                value={setor}
                onChange={(e) =>
                  setSetor(e.target.value)
                }
                className="bg-black border border-[#3f3f46] rounded-2xl p-4 text-lg outline-none"
              />

              <input
                type="date"
                value={data}
                onChange={(e) =>
                  setData(e.target.value)
                }
                className="bg-black border border-[#3f3f46] rounded-2xl p-4 text-lg outline-none"
              />

              <div className="grid grid-cols-2 gap-4">

                <input
                  type="time"
                  value={chegada}
                  onChange={(e) =>
                    setChegada(e.target.value)
                  }
                  className="bg-black border border-[#3f3f46] rounded-2xl p-4 text-lg outline-none"
                />

                <input
                  type="time"
                  value={saida}
                  onChange={(e) =>
                    setSaida(e.target.value)
                  }
                  className="bg-black border border-[#3f3f46] rounded-2xl p-4 text-lg outline-none"
                />

              </div>

              <textarea
                placeholder="Observações"
                value={obs}
                onChange={(e) =>
                  setObs(e.target.value)
                }
                className="bg-black border border-[#3f3f46] rounded-2xl p-4 min-h-[140px] text-lg outline-none"
              />

              <button
                onClick={adicionarFuncionario}
                className="bg-[#eab308] hover:bg-[#facc15] text-black font-black p-5 rounded-2xl text-lg transition-all"
              >
                Adicionar Funcionário
              </button>

              <button
                onClick={exportarPDF}
                className="bg-white hover:bg-[#d4d4d8] text-black font-black p-5 rounded-2xl text-lg transition-all"
              >
                Exportar PDF
              </button>

            </div>

          </div>

          {/* TABELA */}

          <div
            ref={pdfRef}
            className="bg-[#09090b] border border-[#27272a] rounded-3xl overflow-hidden"
          >

            <table className="w-full table-fixed border-collapse">
              <thead>

                <tr className="bg-[#eab308] text-black">

                  <th className="p-3 text-left text-sm w-[160px]">
  Funcionário
</th>

                  <th className="p-3 text-left text-sm w-[120px]">
  Setor
</th>

                  <th className="p-3 text-left text-sm w-[130px]">
  Data
</th>

                 <th className="p-3 text-left text-sm w-[110px]">
  Chegada
</th>

                  <th className="p-3 text-left text-sm w-[110px]">
  Saída
</th>

                <th className="p-3 text-left text-sm">
  Observações
</th>

                 <th className="p-3 text-center text-sm w-[120px]">
  Ações
</th>

                </tr>

              </thead>

              <tbody>

                {funcionarios.length === 0 && (

                  <tr>

                    <td
                      colSpan={7}
                      className="text-center p-12 text-[#71717a] text-sm"
                    >
                      Nenhum funcionário registrado.
                    </td>

                  </tr>

                )}

                {funcionarios.map(
                  (funcionario, index) => (

                    <tr
  key={index}
  className="
    border-t
    border-[#27272a]
    bg-black
    hover:bg-[#111111]
  "
>

  <td className="p-2">
    <input
      type="text"
      value={funcionario.nome}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "nome",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
      "
    />
  </td>

  <td className="p-2">
    <input
      type="text"
      value={funcionario.setor}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "setor",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
      "
    />
  </td>

  <td className="p-2">
    <input
      type="date"
      value={funcionario.data}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "data",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
      "
    />
  </td>

  <td className="p-2">
    <input
      type="time"
      value={funcionario.chegada}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "chegada",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
      "
    />
  </td>

  <td className="p-2">
    <input
      type="time"
      value={funcionario.saida}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "saida",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
      "
    />
  </td>

  <td className="p-2">
    <textarea
      rows={2}
      value={funcionario.obs}
      onChange={(e) =>
        atualizarFuncionario(
          index,
          "obs",
          e.target.value
        )
      }
      className="
        w-full
        bg-[#18181b]
        border
        border-[#3f3f46]
        rounded-md
        px-2
        py-1
        text-sm
        text-white
        outline-none
        resize-none
      "
    />
  </td>

  <td className="p-2 text-center">
    <button
      onClick={() =>
        removerFuncionario(index)
      }
      className="
        bg-red-600
        hover:bg-red-500
        px-3
        py-2
        rounded-lg
        text-sm
        font-bold
      "
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