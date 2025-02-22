const path = require("path");
const { versioner } = require("../lib/index");

const makeDefaultManager = ({
    semver,
    type = "minor",
    skipSemverFor = "android",
    skipCodeFor = "android",
    pbxFileName,
    resetBuild = false,
} = {}) =>
    versioner({
        root: path.join(__dirname, "ios"),
        project: {
            ios: {
                sourceDir: path.join(__dirname, "ios"),
                xcodeProject: { name: "App.xcworkspace" },
                pbxprojPath: pbxFileName
                    ? path.join(__dirname, "ios", "App.xcodeproj", pbxFileName)
                    : undefined,
            },
        },
    }, {
        type,
        semver,
        skipSemverFor,
        skipCodeFor,
        resetBuild
    });

test("successfully bump version (pre 0.69.x)", () => {
    const manager = makeDefaultManager({
        pbxFileName: "project.pbxproj",
    }).dryRun();

    expect(manager.pbx.content).toMatchSnapshot();
});

test("successfully bump version", () => {
    const manager = makeDefaultManager().dryRun();

    expect(manager.pbx.content).toMatchSnapshot();
});

test("skip semVer when asked", () => {
    const manager = makeDefaultManager({ skipSemverFor: "all" }).dryRun();

    expect(manager.pbx.content).toMatchSnapshot();
});

test("direct set semver string", () => {
    const manager = makeDefaultManager({ semver: "1.1.2" }).dryRun();

    expect(manager.pbx.content).toMatchSnapshot();
    expect(manager.packageJSON.content).toMatchSnapshot();
});

test("resets to 1 build number when changing semver", () => {
  const manager = makeDefaultManager({
    type: "patch",
    resetBuild: true,
  }).dryRun();

  expect(manager.pbx.content).toMatchSnapshot();
  expect(manager.packageJSON.content).toMatchSnapshot();
});

test("resets to 1 build number when skipping", () => {
  const manager = makeDefaultManager({
    resetBuild: true,
    skipSemverFor: "all",
  }).dryRun();

  expect(manager.pbx.content).toMatchSnapshot();
  expect(manager.packageJSON.content).toMatchSnapshot();
});
