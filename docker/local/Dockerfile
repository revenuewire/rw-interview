FROM revenuewire/docker-php7-xenial

#### app specific ####
ARG MY_IP

RUN apt-get install php-xdebug -y

COPY xdebug.ini /etc/php/7.0/mods-available/xdebug.ini
RUN echo "xdebug.remote_host=${MY_IP}" >> /etc/php/7.0/mods-available/xdebug.ini

COPY php.ini /etc/php/7.0/apache2/php.ini
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

RUN chown -R www-data:www-data /var/www