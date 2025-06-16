IMAGE_NAME = czak/foodie
SHA = $(shell git rev-parse --short HEAD)
POD = $(shell kubectl get pods -l app=foodie -o jsonpath='{.items[0].metadata.name}')

docker/image:
	docker build -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${SHA} .

docker/push:
	docker push ${IMAGE_NAME}:latest
	docker push ${IMAGE_NAME}:${SHA}

kube/logs:
	kubectl logs -f --container foodie ${POD}

kube/console:
	kubectl exec -it --container foodie ${POD} -- bin/rails console

kube/dbconsole:
	kubectl exec -it --container foodie ${POD} -- bin/rails dbconsole --include-password

kube/shell:
	kubectl exec -it --container foodie ${POD} -- bash

kube/deploy:
	kubectl patch deployment foodie \
		-p '{"spec": {"template": {"metadata": {"annotations": {"app.git.ref": "${SHA}"}}}}}'

kube/undo:
	kubectl rollout undo deployment/foodie

.PHONY: docker/image docker/push kube/logs kube/console kube/dbconsole kube/deploy kube/undo
