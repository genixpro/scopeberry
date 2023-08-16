#!/usr/bin/env bash

# shellcheck disable=SC1090
source deployment/environments/$SCOPEBERRY_ENV.sh

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__SCOPEBERRY_ENV__/$SCOPEBERRY_ENV/g;s/__MAX_SURGE__/$MAX_SURGE/g;s/__MAX_UNAVAILABLE__/$MAX_UNAVAILABLE/g" deployment/frontend/frontend_server_deployment.yaml > frontend_server_deployment_$SCOPEBERRY_ENV.yaml
kubectl apply -f frontend_server_deployment_$SCOPEBERRY_ENV.yaml

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__SCOPEBERRY_ENV__/$SCOPEBERRY_ENV/g;s/__MINIMUM_REPLICATIONS__/$MINIMUM_REPLICATIONS/g;s/__MAXIMUM_REPLICATIONS__/$MAXIMUM_REPLICATIONS/g" deployment/frontend/frontend_autoscaler.yaml > frontend_autoscaler_$SCOPEBERRY_ENV.yaml
kubectl apply -f frontend_autoscaler_$SCOPEBERRY_ENV.yaml

sed "s/__REVISION_ID__/$REVISION_ID/g;s/__SCOPEBERRY_ENV__/$SCOPEBERRY_ENV/g" deployment/frontend/frontend_service.yaml > frontend_service_$SCOPEBERRY_ENV.yaml
kubectl apply -f frontend_service_$SCOPEBERRY_ENV.yaml

