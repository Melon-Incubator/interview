# 定义变量
BRANCH_NAME = main

# 推送代码到主分支
push:
	git add .
	git commit -m "feat: 发布文档"
	git push origin $(BRANCH_NAME)
