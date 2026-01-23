# Configuración SSL con Let's Encrypt
# ssl-setup.sh
#!/bin/bash

# Instalar Certbot
sudo apt update
sudo apt install certbot python3-certbot-nginx

# Obtener certificado SSL
sudo certbot --nginx -d taskflow.com -d www.taskflow.com

# Configurar renovación automática
sudo crontab -e
# Agregar: 0 12 * * * /usr/bin/certbot renew --quiet

# Verificar renovación
sudo certbot renew --dry-run

# Backup de certificados
sudo tar -czf ssl_backup_$(date +%Y%m%d).tar.gz /etc/letsencrypt/