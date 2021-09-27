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
        const githubErrors = [];
        const usersCreated = [];
        let usersBug = 0;

        // // Décommenter ce bloc de code pour faire des essais. Les deux users github ci-dessous peuvent être testés.
        // orga = "aleks-test-dev-2"
        // teamsNames = req.query.teamsNames.split(',');
        // githubUsers = ["lxoclock", "aleks123abchessleré", "alexishessler", "aleks123abchessleré333"]
        // console.log("orga 2 --> ", orga);
        // console.log("teamsNames 2 --> ", teamsNames);
        // console.log("githubUsers 2 --> ", githubUsers);

        const execCreateTeamsAndProjects = async (counter) => {
           
            if(counter < teamsNames.length){

              try {

                try {
                  const teamCreate = await octokit.request(`POST /orgs/${orga}/teams`, {
                    name:teamsNames[counter],
                  })   
                  githubErrors.push({"STEP 1 > TEAM CREATION" : "SUCCESS"})
                } catch(catchStep1) {
                  githubErrors.push({"STEP 1 > TEAM CREATION" : catchStep1.response.data ? catchStep1.response.data : catchStep1})
                }
    
                try {
                  const repoCreate = await octokit.request(`POST /orgs/${orga}/repos`, {
                      name:`projet-${teamsNames[counter].split('team-')[1]}`,
                      private: true,
                  })
                  githubErrors.push({"STEP 2 > REPOSITORY CREATION" : "SUCCESS"})
                } catch(catchStep2){
                  githubErrors.push({"STEP 2 > REPOSITORY CREATION" : catchStep2.response.data ? catchStep2.response.data : catchStep2}) 
                }

                try {

                  setTimeout(async () => {
                    // security of 2000ms to update the rights of team created just now
                    const teamUpdate = await octokit.request(`PUT /orgs/${orga}/teams/${teamsNames[counter]}/repos/${orga}/projet-${teamsNames[counter].split('team-')[1]}`, {
                        permission: 'maintain'
                      })
                      console.log("ERRRRRROR 1")
                      console.log(teamUpdate)
                  }, 2000);
                  githubErrors.push({"STEP 3 > TEAM RIGHTS TO REPO" : "SUCCESS"})
                } catch(catchStep3) {
                  githubErrors.push({"STEP 3 > TEAM RIGHTS TO REPO" : catchStep3.response.data ? catchStep3.response.data : catchStep3})
                }

                const execRequestSingleUser = async (userCount) => {

                    if(userCount < githubUsers.length){

                        try {
                          console.log(`Request executed --> PUT /orgs/${orga}/teams/${teamsNames[counter]}/memberships/${githubUsers[userCount]}`)
                          const adduser = await octokit.request(`PUT /orgs/${orga}/teams/${teamsNames[counter]}/memberships/${githubUsers[userCount]}`, {})
                          usersCreated.push({[`User n°${userCount+1} > ${githubUsers[userCount]}`]:"SUCCESS"})
                        } catch(catchStep4){
                          usersBug++;
                          usersCreated.push({[`User n°${userCount+1} > ${githubUsers[userCount]}`]:catchStep4.status == 404 ? "USER NOT FOUND" : "ERROR"})
                        }
                        userCount++
                        await execRequestSingleUser(userCount)

                    } else {
                        githubErrors.push({"STEP 4 > USERS ADDED TO TEAM" : `${usersBug === 0 ? "SUCCESS FOR ALL USERS" : "SOME ERRORS OCCURED" }`})
                        githubErrors.push(usersCreated)
                        counter++
                        await execCreateTeamsAndProjects(counter)

                    }
                }

                if(
                  githubErrors[0]["STEP 1 > TEAM CREATION"] === "SUCCESS" &&  
                  githubErrors[1]["STEP 2 > REPOSITORY CREATION"] === "SUCCESS"
                ){
                  await execRequestSingleUser(0)
                } else {
                  githubErrors.push({"CODA FINAL ERROR MESSAGE" : "WARNING : Pour cette équipe d'apo, il faudra intervenir manuellement sur les assets correspondants (projet github, team github, et membres)."})
                  res.json({result: false, githubErrors});
                }

              } catch(err) {
                githubErrors.push({"CODA FINAL ERROR MESSAGE" : "WARNING : Pour cette équipe d'apo, il faudra intervenir manuellement sur les assets correspondants (projet github, team github, et membres)."})
                console.log(err)
                res.json({result: false, githubErrors});
              }

            } else {

                res.json({
                    result: true, 
                    url: `https://www.github.com/${orga}`,
                    githubErrors,
                    "CODA FINAL SUCCESS MESSAGE": "GITHUB ACTIONS DONE - Attention à bien vérifier les 4 étapes"
                });
            }

          }

          execCreateTeamsAndProjects(0)     
    },

};


module.exports = mainController;