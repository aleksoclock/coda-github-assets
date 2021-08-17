const { Octokit } = require("@octokit/core");

const octokit = new Octokit({
  auth: process.env.GITHUB_KEY,
});

const mainController = {

    generateGithubAssets: (req, res, next) => {

        let orga = req.query.githubOrga;
        let teamsNames = req.query.teamsNames.split(',');
        let githubUsers = JSON.parse(req.query.userNames);
        console.log("orga 1 --> ", orga);
        console.log("teamsNames 1 --> ", teamsNames);
        console.log("githubUsers 1 --> ", githubUsers);

        // orga = "aleks-test-dev-2"
        // teamsNames = req.query.teamsNames.split(',');
        // githubUsers = ["lxoclock", "alexishessler"]
        // console.log("orga 2 --> ", orga);
        // console.log("teamsNames 2 --> ", teamsNames);
        // console.log("githubUsers 2 --> ", githubUsers);
        // // res.json({result: true})

        const execCreateTeamsAndProjects = async (counter) => {
           
            if(counter < teamsNames.length){

              try {

                const teamCreate = await octokit.request(`POST /orgs/${orga}/teams`, {
                  name:teamsNames[counter],
                })           
    
                const repoCreate = await octokit.request(`POST /orgs/${orga}/repos`, {
                    name:`projet-${teamsNames[counter].split('team-')[1]}`,
                    private: true,
                })

                const teamUpdate = await octokit.request(`PUT /orgs/${orga}/teams/${teamsNames[counter]}/repos/${orga}/projet-${teamsNames[counter].split('team-')[1]}`, {
                    permission: 'maintain'
                })

                const execRequestSingleUser = async (userCount) => {

                    if(userCount < githubUsers.length){

                        console.log(`Request executed --> PUT /orgs/${orga}/teams/${teamsNames[counter]}/memberships/${githubUsers[userCount]}`)
                        const adduser = await octokit.request(`PUT /orgs/${orga}/teams/${teamsNames[counter]}/memberships/${githubUsers[userCount]}`, {})
                        
                        await userCount++
                        await execRequestSingleUser(userCount)

                    } else {

                        console.log("team created --> ", teamsNames[counter]);
                        console.log("repo created --> ", `projet-${teamsNames[counter].split('team-')[1]}`);
                        console.log("users added to the team --> ", githubUsers)
                        console.log("*** team with right users and repo associated ! ***")
        
                        await counter++
                        await execCreateTeamsAndProjects(counter)

                    }
                }

                await execRequestSingleUser(0)

              } catch(err) {

                console.log(err)

                res.json({result: false, err});
                
              }

            } else {

                res.json({
                    result: true, 
                    url: `https://www.github.com/${orga}`
                });
            }

          }

          execCreateTeamsAndProjects(0)     
    },

};


module.exports = mainController;