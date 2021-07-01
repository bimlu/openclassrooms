##########################
# on local machine

# build it locally using production environments variable
# temporarily copy .env.production to .env (don't forget to undo it after build is completed)
cd ~/jhimlish/api &&
tsc

# copy api build to remote
scp -i ~/Documents/aws-credentials/mern-app.pem -r /home/robin/projects/jhimlish/api/build/ ubuntu@bimlee.com:/home/ubuntu/jhimlish/api &&

# login to remote
ssh -i ~/Documents/aws-credentials/mern-app.pem ubuntu@bimlee.com

###########################


###########################
# on remote

cd ~/jhimlish &&
git pull origin main &&
cd ~/jhimlish/client &&
npm i &&
npm run build &&
cd ~/jhimlish/api &&
npm i &&
# tsc, # don't build it here, not enough memory
# assuming that build folder is already copied here
pm2 restart all &&
# sudo systemctl restart nginx && # optional (only do it when changing nginx related config files)
# pm2 start build/index.js -i 0, # if not running already
pm2 monit # or pm2 logs

###########################

# only client build after ssh and git pull and in client/
pm2 status && pm2 stop all && npm run build && pm2 restart all