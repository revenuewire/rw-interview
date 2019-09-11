FROM revenuewire/docker-php7-xenial

#### app specific ####
COPY php.ini /etc/php/7.0/apache2/php.ini
COPY 000-default.conf /etc/apache2/sites-available/000-default.conf

RUN chown -R www-data:www-data /var/www
COPY ./ /var/www