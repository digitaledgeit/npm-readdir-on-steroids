jest.mock("fs");
import readdir from ".";

describe("readdir()", () => {
  it("should resolve with a recursive list of relative paths", async () => {
    const paths = await readdir("ok");
    expect(paths.sort()).toEqual([
      "package.json",
      "src",
      "src/index.test.ts",
      "src/index.ts"
    ]);
  });

  it("should reject when a filesystem error occurs", async () => {
    expect.assertions(1);
    try {
      await readdir("err");
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
    }
  });

  it("should not display filtered files in the list when a listFilter is provided", async () => {
    const paths = await readdir("ok", {
      listFilter: path => !/\.json$/.test(path)
    });
    expect(paths.sort()).toEqual(["src", "src/index.test.ts", "src/index.ts"]);
  });

  it("should not display filtered files in the list when a walkFilter is provided", async () => {
    const paths = await readdir("ok", {
      walkFilter: path => !/src/.test(path)
    });
    expect(paths.sort()).toEqual(["package.json", "src"]);
  });

  it("should emit read events", async () => {
    const spy = jest.fn();
    const paths = readdir("ok");
    paths.on("read", spy);
    await paths;
    expect(spy).toHaveBeenCalledTimes(4);
    expect(spy).toHaveBeenCalledWith(
      "package.json",
      expect.objectContaining({
        root: "ok",
        depth: 0
      })
    );
  });
});
