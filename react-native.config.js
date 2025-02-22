const { versioner } = require("./lib/index");

module.exports = {
    commands: [{
        name: "bump-version",
        func: (_, config, args) => {
            versioner(config, args).run();
        },
        options: [
            {
                name: "--type [major|minor|patch]",
                description: "SemVer release type, optional if --skip-semver-for all is passed",
            },
            {
                name: "--semver [String]",
                description: "Pass release version if known. Overwrites calculated SemVer. Optional.",
            },
            {
                name: "--skip-semver-for [android|ios|all]",
                description: "Skips bump SemVer for specified platform",
            },
            {
                name: "--skip-code-for [android|ios|all]",
                description: "Skips bump version codes for specified platform",
            },
            {
                name: "--reset-build",
                description: "Resets build number to 1",
            },
        ],
    }],
};
