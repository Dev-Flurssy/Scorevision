import { spawn } from "child_process";

const DEFAULT_PYTHON_EXE = "python3";

export const runPython = (script: string, args: string[], cwd?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const pythonExe = process.env.PYTHON_PATH || DEFAULT_PYTHON_EXE;

    const py = spawn(pythonExe, [script, ...args], { cwd });

    let out = "";
    let err = "";

    py.stdout.on("data", (d) => (out += d));
    py.stderr.on("data", (d) => (err += d));

    py.on("close", (code) => {
      if (code !== 0) {
        reject(
          new Error(
            `Python exited with code ${code}. Interpreter: ${pythonExe}\n${err || out}`,
          ),
        );
      } else {
        resolve(out);
      }
    });

    py.on("error", (error) => reject(error));
  });
};
