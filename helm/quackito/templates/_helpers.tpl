{{/*
Chart name
*/}}
{{- define "quackito.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Fullname: release-chart
*/}}
{{- define "quackito.fullname" -}}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "quackito.labels" -}}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version | replace "+" "_" }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Client labels
*/}}
{{- define "quackito.client.labels" -}}
{{ include "quackito.labels" . }}
app.kubernetes.io/name: {{ include "quackito.name" . }}-client
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: client
{{- end }}

{{/*
Server labels
*/}}
{{- define "quackito.server.labels" -}}
{{ include "quackito.labels" . }}
app.kubernetes.io/name: {{ include "quackito.name" . }}-server
app.kubernetes.io/instance: {{ .Release.Name }}
app.kubernetes.io/component: server
{{- end }}

{{/*
Client selector labels
*/}}
{{- define "quackito.client.selectorLabels" -}}
app.kubernetes.io/name: {{ include "quackito.name" . }}-client
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Server selector labels
*/}}
{{- define "quackito.server.selectorLabels" -}}
app.kubernetes.io/name: {{ include "quackito.name" . }}-server
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
PostgreSQL host — points to the bitnami subchart service
*/}}
{{- define "quackito.postgresql.host" -}}
{{ .Release.Name }}-postgresql
{{- end }}
