const path = require("path");
const { versioner } = require("../lib/index");

const makeDefaultManager = ({
  semver,
  type = "minor",
  skipSemverFor = "ios",
  skipCodeFor = "ios",
  appName = "double",
  resetBuild = false,
} = {}) =>
  versioner(
    {
      root: path.join(__dirname, "android"),
      project: {
        android: {
          appName: appName,
          sourceDir: path.join(__dirname, "android"),
        },
      },
    },
    {
      type,
      semver,
      skipSemverFor,
      skipCodeFor,
      resetBuild,
    }
  );

test("successfully bump version", () => {
  const manager = makeDefaultManager().dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
});

test("skip semVer when asked", () => {
  const manager = makeDefaultManager({ skipSemverFor: "all" }).dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
});

test("preserve quotes style", () => {
  const manager = makeDefaultManager({ appName: "single" }).dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
});

test("direct set semver string", () => {
  const manager = makeDefaultManager({ semver: "1.1.2" }).dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
  expect(manager.packageJSON.content).toMatchSnapshot();
});

test("resets to 1 build number when changing semver", () => {
  const manager = makeDefaultManager({
    type: "patch",
    appName: "active",
    resetBuild: true,
  }).dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
  expect(manager.packageJSON.content).toMatchSnapshot();
});

test("resets to 1 build number when skipping", () => {
  const manager = makeDefaultManager({
    appName: "active",
    resetBuild: true,
    skipSemverFor: "all",
  }).dryRun();

  expect(manager.buildGradle.content).toMatchSnapshot();
  expect(manager.packageJSON.content).toMatchSnapshot();
});
