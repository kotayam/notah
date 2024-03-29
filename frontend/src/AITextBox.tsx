import { CanvasElement } from "./Classes.ts";
import { AITextBoxProps } from "./Props.ts";
import refreshToken from "./Authentication.ts";
import { useEffect, useState, MouseEvent, FormEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "@reduxjs/toolkit";
import { actionCreators, rootState } from "./store/index.ts";
import API from "./API.json";

const apiLink = API["isDev"] ? API["API"]["dev"] : API["API"]["production"];

export default function AITextBox({
  elt,
  selectAITextBox,
  selectedElt,
}: AITextBoxProps) {
  const account = useSelector((state: rootState) => state.account);
  const dispatch = useDispatch();
  const { deleteCanvasElement, updateCanvasElement, setSaved, setAccount } =
    bindActionCreators(actionCreators, dispatch);
  let canvasElements = useSelector((state: rootState) => state.canvasElements);
  canvasElements = new Map(canvasElements);
  const page = useSelector((state: rootState) => state.page);
  const isSaved = useSelector((state: rootState) => state.isSaved);
  const [canvasElts, _] = useState(
    canvasElements.get(page.id) || new Array<CanvasElement>()
  );
  const [border, setBorder] = useState("border-0");
  const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
  const [drag, setDrag] = useState(false);
  const [contents, setContents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedElt.id === elt.id) {
      setBorder("border-2");
      setVisibility("visible");
    } else {
      setBorder("border-0");
      setVisibility("hidden");
    }
  }, [selectedElt.id]);

  useEffect(() => {
    const splitter = new RegExp("</p>");
    const splitted = elt.innerHtml.split(splitter);
    const matcher = new RegExp("<p class=.*>([^]+)");
    const res: string[] = [];
    splitted.forEach((reg) => {
      const content = reg.match(matcher);
      if (content) {
        res.push(content[1]);
      }
    });
    setContents(res);
  }, [elt.innerHtml]);

  const handleMouseDown = () => {
    setDrag(true);
  };

  const handleMouseMove = (e: MouseEvent, parent: HTMLButtonElement) => {
    e.preventDefault();
    if (!drag) return;
    const canvas = document.getElementById("canvas");
    if (!canvas) return;
    const midX = parent.offsetLeft + parent.offsetWidth / 2;
    const midY = parent.offsetTop + parent.offsetHeight / 2;
    const newX = e.pageX - midX - canvas.offsetLeft;
    const newY = e.pageY - midY - canvas.offsetTop;
    const curr = canvasElts.filter((ce) => elt.id === ce.id)[0];
    curr.x = newX;
    curr.y = newY + 26;
    updateCanvasElement(page.id, curr.id, curr);
  };

  const handleMouseUp = () => {
    setDrag(false);
    setSaved(false);
  };

  const deleteAITextBox = () => {
    if (!isSaved) {
      deleteCanvasElement(page.id, elt.id, elt);
      return;
    }
    fetch(apiLink + `CanvasElements/${elt.id}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((_) => {
        deleteCanvasElement(page.id, elt.id, elt);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `CanvasElements/${elt.id}`, {
            method: "DELETE",
            credentials: "include",
          })
            .then((res) => res.json())
            .then((_) => {
              deleteCanvasElement(page.id, elt.id, elt);
            })
            .catch((_) => {
              window.location.href = "/login?status=error";
            });
        }
      });
  };

  const generateAnswer = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      prompt: { value: string };
    };
    const prompt = target.prompt.value;
    if (!prompt) return;
    setLoading(true);
    setContents((prev) => [...prev, `Q: ${prompt}`]);
    fetch(apiLink + `CanvasElements/generateAnswer/${account.id}`, {
      method: "POST",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: prompt }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        target.prompt.value = "";
        if (data.status === 404) {
          setContents((prev) => {
            const curr = [...prev];
            curr.pop();
            return curr;
          });
          alert("Failed to generate answer.");
          return;
        } else if (data.status === 400) {
          setContents((prev) => {
            const curr = [...prev];
            curr.pop();
            return curr;
          });
          alert("Usage limit reached.");
          return;
        }
        setSaved(false);
        setContents((prev) => [...prev, `A: ${data.answer}`]);
        account.aiUsageLimit = data.aiUsageLimit;
        setAccount(account);
      })
      .catch(async (_) => {
        const authorized = await refreshToken();
        if (authorized) {
          fetch(apiLink + `CanvasElements/generateAnswer/${account.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ prompt: prompt }),
          })
            .then((res) => res.json())
            .then((data) => {
              setLoading(false);
              target.prompt.value = "";
              if (data.status === 404) {
                setContents((prev) => {
                  const curr = [...prev];
                  curr.pop();
                  return curr;
                });
                alert("Failed to generate answer.");
                return;
              } else if (data.status === 400) {
                setContents((prev) => {
                  const curr = [...prev];
                  curr.pop();
                  return curr;
                });
                alert("Usage limit reached.");
                return;
              }
              setSaved(false);
              setContents((prev) => [...prev, `A: ${data.answer}`]);
              account.aiUsageLimit = data.aiUsageLimit;
              setAccount(account);
            })
            .catch((_) => {
              setLoading(false);
              target.prompt.value = "";
              setContents((prev) =>
                prev.filter((_, idx) => idx !== prev.length - 1)
              );
              alert("Something went wrong. Please try again later.");
            });
        }
      });
  };

  return (
    <div
      className={`absolute`}
      style={{ top: elt.y - 26, left: elt.x }}
      onClick={(_) => {
        selectAITextBox(elt);
      }}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseEnter={(_) => {
        if (visibility === "hidden") {
          setVisibility("visible");
          setBorder("border-2");
        }
      }}
      onMouseLeave={(_) => {
        if (selectedElt.id !== elt.id) {
          setBorder("border-0");
          setVisibility("hidden");
        }
      }}
    >
      <div
        className={`bg-gray-100 flex justify-between ${border} border-b-0`}
        style={{ visibility: visibility }}
      >
        <button
          name="move-elt"
          onMouseDown={(_) => handleMouseDown()}
          onMouseMove={(e) => handleMouseMove(e, e.currentTarget)}
          onMouseUp={(_) => handleMouseUp()}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-6"
          >
            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
          </svg>
        </button>
        <button name="delete-elt" onClick={() => deleteAITextBox()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </div>
      <div
        id={elt.id}
        key={elt.id}
        className="grid-cols-1 place-content-center border-2"
      >
        <div className="mb-2 py-1 px-2 min-w-[150px] max-w-[500px] max-h-[250px] grid grid-cols-1 overflow-y-scroll">
          {contents.map((c, idx) => (
            <p key={idx} className="mb-1 whitespace-pre-wrap">
              {c}
            </p>
          ))}
          <div className="flex justify-center items-center">
            <div
              className="rounded-full border-4 border-solid h-5 w-5 border-r-transparent border-blue-500 animate-spin"
              style={{ display: loading ? "" : "none" }}
            ></div>
          </div>
        </div>
        <form
          className="grid-cols-1 place-content-center p-1"
          onSubmit={(e) => generateAnswer(e)}
        >
          <textarea
            name="prompt"
            placeholder="Enter prompt..."
            className="w-full bg-gray-100 outline-none resize-none"
            onMouseDown={(_) => focus()}
          />
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="p-1 rounded-md bg-gray-200 hover:bg-gray-300 active:bg-gray-400 font-semibold flex justify-center items-center w-full"
            >
              <div
                className="font-semibold"
                style={{ display: loading ? "none" : "" }}
              >
                Generate
              </div>
              <div
                className="rounded-full border-4 border-solid h-5 w-5 border-r-transparent border-blue-500 animate-spin"
                style={{ display: loading ? "" : "none" }}
              ></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
