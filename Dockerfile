# Multi-architecture production Dockerfile for SpeechTexter
# Supports ARM64 (Raspberry Pi 3/4/5), ARMv7 (32-bit Pi), and AMD64 (x86_64)

FROM --platform=$TARGETPLATFORM nginx:alpine

LABEL maintainer="SpeechTexter Self-Hosted"
LABEL description="Free online speech-to-text dictation application"

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy application assets
COPY index.html /usr/share/nginx/html/
COPY css/ /usr/share/nginx/html/css/
COPY js/ /usr/share/nginx/html/js/

# Set proper permissions
RUN chmod -R 755 /usr/share/nginx/html

# Expose HTTP port
EXPOSE 80

# Healthcheck for Coolify
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

CMD ["nginx", "-g", "daemon off;"]
