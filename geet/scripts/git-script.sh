cd ~/projects/jhimlish &&
git checkout main &&
git merge develop &&
git checkout main-backup &&
git merge develop &&
git checkout develop &&
git push origin --all &&
git push origin --tags &&
git log