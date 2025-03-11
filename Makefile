# 定义变量
BRANCH_NAME = main

push: 
	yarn && yarn docs:build
	git add .
	git commit -m "feat: "
	git push origin $(BRANCH_NAME)
