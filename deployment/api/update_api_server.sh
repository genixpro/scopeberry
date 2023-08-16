#!/usr/bin/env bash

# shellcheck disable=SC1090
source deployment/environments/$PLANGURU_ENV.sh

kubectl apply -f deployment/priorities/default.yaml
kubectl apply -f deployment/priorities/$PLANGURU_ENV.yaml
kubectl apply -f deployment/priorities/${PLANGURU_ENV}_background.yaml

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__PLANGURU_ENV__/$PLANGURU_ENV/g;s/__MAX_SURGE__/$MAX_SURGE/g;s/__MAX_UNAVAILABLE__/$MAX_UNAVAILABLE/g" deployment/api/api_server_deployment.yaml > api_server_deployment_$PLANGURU_ENV.yaml
kubectl apply -f api_server_deployment_$PLANGURU_ENV.yaml

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__PLANGURU_ENV__/$PLANGURU_ENV/g;s/__MINIMUM_REPLICATIONS__/$MINIMUM_REPLICATIONS/g;s/__MAXIMUM_REPLICATIONS__/$MAXIMUM_REPLICATIONS/g" deployment/api/api_autoscaler.yaml > api_autoscaler_$PLANGURU_ENV.yaml
kubectl apply -f api_autoscaler_$PLANGURU_ENV.yaml

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__PLANGURU_ENV__/$PLANGURU_ENV/g" deployment/api/api_service.yaml > api_service_$PLANGURU_ENV.yaml
kubectl apply -f api_service_$PLANGURU_ENV.yaml
