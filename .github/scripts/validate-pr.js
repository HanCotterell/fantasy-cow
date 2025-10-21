// Validation logic for PRs
import { Octokit } from "@octokit/rest";

// Environment variables
const token = process.env.GITHUB_TOKEN;
const pr_number = Number(process.env.PR_NUMBER);
const repoFullName = process.env.GITHUB_REPOSITORY;
const octokit = new Octokit({ auth: token });

// Identify the PR
const [owner, repo] = repoFullName.split("/");

async function run() {
    try {
        const { data: pr } = await octokit.pulls.get({
            owner,
            repo,
            pull_number: pr_number
        });

        console.log(`🔍 Validating PR #${pr_number} from ${pr.user.login}`);

        // Get files in PR
        const { data: files } = await octokit.pulls.listFiles({
            owner,
            repo,
            pull_number: pr_number
        });

        const jsonFiles = files.filter(f => f.filename.endsWith(".json"));
        const imageFiles = files.filter(f => f.filename.startsWith("images/"));
        const requiredKeys = ["name", "breed", "image"];

        // --- Basic pre-checks ---
        if (jsonFiles.length === 0) {
            await comment("❌ No JSON file found! Please include your **<cow>.json** file.");
            process.exit(1);
        }

        // There should only be one JSON file in the PR
        if (jsonFiles.length > 1) {
            await comment("❌ Multiple JSON files found! Please include only one **<cow>.json** file.");
            process.exit(1);
        }

        // --- Load and parse JSON file ---
        const file = jsonFiles[0];
        let data, rawContent;

        try {
            const response = await fetch(file.raw_url);
            const content = await response.text();
            data = JSON.parse(content);
            rawContent = content;
        } catch {
            await comment(`❌ File **${file.filename}** is not valid JSON!`);
            process.exit(1);
        }

        // Helper: check if referenced image exists
        const imageExists = imageFiles.some(img => img.filename === data.image);

        // --- Tests ---
        const testsToRun = [
            {
                name: "Check PR is from Fork",
                test: ({ pr }) =>
                    pr.head.repo.full_name !== pr.base.repo.full_name,
                failMsg:
                    "❌ It looks like your PR is from a branch in the same repo. You need to open it **from your fork** to the main repo."
            },
            {
                name: "Validate JSON Content",
                test: ({ data }) => {
                    const missing = requiredKeys.filter(key => !data[key]);
                    return missing.length > 0
                        ? { valid: false, missing }
                        : { valid: true };
                },
                failMsg: ({ missing }) =>
                    `❌ File **${file.filename}** is missing: ${missing.join(", ")}`
            },
            {
                name: "Check image path",
                test: ({ data }) => data.image?.startsWith("images/"),
                failMsg:
                    `❌ Image path in **${file.filename}** must start with "images/".`
            },
            {
                name: "Check image file exists",
                test: ({ data, imageExists }) => imageExists,
                failMsg:
                    `❌ Image file **${data.image}** specified in **${file.filename}** does not exist in the PR.`
            },
            {
                name: "Check file naming convention",
                test: ({ data }) => {
                    const normalizedName = data.name.toLowerCase().replace(/ /g, '_');
                    const expectedImageNamePng = `images/${normalizedName}.png`;
                    const expectedImageNameJpg = `images/${normalizedName}.jpg`;
                    return (
                        data.image === expectedImageNamePng ||
                        data.image === expectedImageNameJpg
                    );
                },
                failMsg:
                    `❌ Image file name in **${file.filename}** should be based on the cow's name. Expected: images/${data.name.toLowerCase().replace(/ /g, '_')}.png or .jpg`
            },
            {
                name: "Check proper indentation",
                test: ({ rawContent }) => {
                    const lines = rawContent.split("\n");
                    return lines.every(line => {
                        const trimmed = line.trim();
                        if (trimmed === "{" || trimmed === "}" || trimmed === "") return true;
                        return line.startsWith("\t") && !line.startsWith("\t\t");
                        // TODO: Perhaps allow spaces as well? Some editors automatically convert tabs to spaces.
                    });
                },
                failMsg: `❌ File **${file.filename}** is not properly indented with 1 tab.`
            },
            {
                name: "Check line endings",
                test: ({ rawContent }) => !rawContent.includes("\r\n"),
                failMsg: `❌ File **${file.filename}** contains Windows-style line endings (CRLF). Please convert to Unix-style (LF) line endings.`
            }
        ];

        // --- Run tests ---
        let testsPassed = 0;
        let commentString = `### 🧪 PR Validation Results for #${pr_number}\n\n`;

        for (const testObj of testsToRun) {
            const result = testObj.test({ pr, data, file, imageExists, rawContent });
            const valid = result === true || result.valid;

            if (valid) {
                commentString += `✅ **${testObj.name}** passed!\n`;
                testsPassed++;
            } else {
                const failMessage =
                    typeof testObj.failMsg === "function"
                        ? testObj.failMsg(result)
                        : testObj.failMsg;
                commentString += `${failMessage}\n`;
            }
        }

        commentString += `\n---\n\n`;

        if (testsPassed === testsToRun.length) {
            commentString += `✅ All tests passed! Nice work on your PR! 🎉`;
            await comment(commentString);
            process.exit(0);
        } else {
            commentString += `❌ ${testsPassed}/${testsToRun.length} passed. Please fix the issues above and update your PR.`;
            await comment(commentString);
            process.exit(1);
        }

    } catch (err) {
        console.error("Error validating PR:", err);
        process.exit(1);
    }
}

// Helper: Comment on the PR
async function comment(message) {
    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr_number,
        body: message,
    });
}

run();
