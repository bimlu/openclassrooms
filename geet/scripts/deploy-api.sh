##########################
# on local machine

# build it locally using production environments variable
# temporarily copy .env.production to .env (don't forget to undo it after build is completed)
cd ~/projects/jhimlish/api &&
tsc &&

# copy api build to remote
scp -i ~/Documents/aws-credentials/mern-app.pem -r /home/robin/projects/jhimlish/api/build/ ubuntu@bimlee.com:/home/ubuntu/jhimlish/api &&

# login to remote
ssh -i ~/Documents/aws-credentials/mern-app.pem ubuntu@bimlee.com

# on remote
cd ~/jhimlish &&
git pull origin main &&
cd ~/jhimlish/api &&
pm2 restart all