# login to remote
ssh -i ~/Documents/aws-credentials/mern-app.pem ubuntu@bimlee.com

# on remote
pm2 status && 
pm2 stop all &&
cd ~/jhimlish &&
git pull origin main &&
cd ~/jhimlish/client &&
npm i &&
npm run build && 
pm2 restart all