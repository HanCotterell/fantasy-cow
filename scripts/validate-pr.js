// Validation logic for PRs
import { Octokit } from "@octokit/rest";

// Environment variables
const token = process.env.GITHUB_TOKEN;
const pr_number = process.env.PR_NUMBER;
const repoFullName = process.env.GITHUB_REPOSITORY;
const octokit = new Octokit({ auth: token });

// Identify the PR
const [owner, repo] = repoFullName.split("/");

async function run() {
    try {
        const { data: pr } = await octokit.pulls.get({ owner, repo, pr_number: pr_number });

        console.log(`Validating PR #${pr_number} from ${pr.user.login}`);

        // Check if PR is from a fork
        if (pr.head.repo.full_name === pr.base.repo.full_name) {
            await comment(`❌ It looks like your PR is from a branch in the same repo.
                        You need to open it **from your fork** to the main repo.`);
            process.exit(1);
        }

        // Check for required files
        const files = await octokit.pulls.listFiles({ owner, repo, pr_number: pr_number });
        const jsonFiles = files.data.filter(f => f.filename.endsWith(".json"));

        if (jsonFiles.length === 0) {
            await comment(`❌ No JSON file found! Please include your **cow.json** file.`);
            process.exit(1);
        }

        // Validate the cow.json content
        const requiredKeys = ["name", "breed", "image"];

        for (const file of jsonFiles) {
            try {
                const response = await fetch(file.raw_url);
                const content = await response.text();
                const data = JSON.parse(content);

                const missing = requiredKeys.filter(key => !data[key]);
                if (missing.length > 0) {
                    await comment(`⚠️ File **${file.filename}** is missing: ${missing.join(", ")}`);
                    process.exit(1);
                }
            } catch {
                await comment(`❌ File **${file.filename}** is not valid JSON!`);
                process.exit(1);
            }
        }

        await comment(`✅ Everything looks great! Nice work on your first PR! 🎉`);
    } catch (err) {
        console.error("Error validating PR:", err);
        process.exit(1);
    }
}

async function comment(message) {
    // Helper function to post a comment on the PR
    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pr_number,
        body: message,
    });
}

run();
