---
description: >-
  This installation guide will help you deploy OpenMetadata on your own
  machine(s) without the use of Docker.
---

# Deploy on Bare Metal

## Requirements

This guide assumes you have access to a command-line environment or shell such as bash, zsh, etc. or Linux or Mac OS X or PowerShell on Microsoft Windows.

This guide also assumes that your command-line environment has access to the `tar` utility.

Please review additional requirements listed in the subsections below.

### Java (version 11.0.0 or greater)

OpenMetadata is built using Java, DropWizard, and Jetty.

Type the following command to verify that you have a supported version of the Java runtime installed.

```
java --version
```

To install Java or upgrade to Java 11 or greater, see the instructions for your operating system at [How do I install Java?](https://java.com/en/download/help/download\_options.html#mac)

### MySQL (version 8.0.0 or greater)

To install MySQL see the instructions for your operating system (OS) at [Installing and Upgrading MySQL](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/installing.html) or visit one of the following OS-specific guides.

* [Installing MySQL on Linux](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/linux-installation.html)
* [Installing MySQL on Microsoft Windows](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/windows-installation.html)
* [Installing MySQL on macOS](https://dev.mysql.com/doc/mysql-installation-excerpt/8.0/en/macos-installation.html)

{% hint style="info" %}
Make sure to configure required databases and users for OpenMetadata.

You can refer a sample script from [here](https://github.com/open-metadata/OpenMetadata/blob/main/docker/local-metadata/mysql-script.sql).
{% endhint %}

### Elasticsearch (version 7.X)

To install or upgrade Elasticsearch to a supported version please see the instructions for your operating system at [Installing Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/current/install-elasticsearch.html).

We do not support ElasticSearch 8.x yet.

Please follow the instructions[ here to install Elasticsearch](https://www.elastic.co/guide/en/elasticsearch/reference/7.17/setup.html)

### Airflow (version 2.0.0 or greater) or other workflow schedulers

OpenMetadata performs metadata ingestion using ingestion connectors designed to run in Airflow or another workflow scheduler.

To install Airflow, please see the [Airflow Installation](https://airflow.apache.org/docs/apache-airflow/stable/installation/index.html) guide.

## Procedure

### 1. Download the distribution

Visit the [releases page](https://github.com/open-metadata/OpenMetadata/releases) and download the latest binary release. Release binaries follow the naming convention of `openmetadata-x.y.z.tar.gz`. Where `x`, `y`, and `z` represent the major, minor, and patch release numbers.

For example, the release for version 0.6 is found in the Assets section at the link highlighted in the figure below.

<img src="../docs/.gitbook/assets/image (4) (2) (1) (1) (1).png" alt="" data-size="original">

### 2. Untar the release download

Once the tar file has download, run the following command, updated if necessary for the version of OpenMetadata that you downloaded.

```bash
tar -zxvf openmetadata-0.10.0.tar.gz
```

### 3. Navigate to the directory created

```
cd openmetadata-0.10.0
```

Review and update the `openmetadata.yaml` configurations to match your environment. Specifically, consider aspects such as the connection to the MySQL database or ElasticSearch. You can find more information about these configurations [here](reference/configuration.md).

### 4. Prepare OpenMetadata Database

```
./bootstrap/bootstrap_storage.sh drop-create-all
```

### 5. Start OpenMetadata

OpenMetadata release ships with `./bin/openmetadata` init.d style script. Run the following command from the `openmetadata-0.9.0` directory.

```
./bin/openmetadata.sh start
```

We recommend configuring `serviced` to monitor the OpenMetadata command to restart in case of any failures.

## Run OpenMetadata with a load balancer

You may put one or more OpenMetadata instances behind a load balancer for reverse proxying. To do this you will need to add one or more entries to the configuration file for your reverse proxy.

### Apache mod\_proxy

To use the Apache mod\_proxy module as a reverse proxy for load balancing, update the `VirtualHost` tag in your Apache config file to resemble the following.

```
  <VirtualHost *:80>
      <Proxy balancer://mycluster>
          BalancerMember http://127.0.0.1:8585 <!-- First OpenMetadata server -->
          BalancerMember http://127.0.0.2:8686 <!-- Second OpenMetadata server -->
      </Proxy>

      ProxyPreserveHost On

      ProxyPass / balancer://mycluster/
      ProxyPassReverse / balancer://mycluster/
  </VirtualHost>
```

### Nginx

To use OpenMetadata behind an Nginx reverse proxy, add an entry resembling the following the `http` context of your Nginx configuration file for each OpenMetadata instance.

```
server {
    access_log /var/log/nginx/stage-reverse-access.log;
    error_log /var/log/nginx/stage-reverse-error.log;         
    server_name stage.open-metadata.org;
    location / {
        proxy_pass http://127.0.0.1:8585;
    }
}
```

## Next Steps

1. Visit the [Features](../docs/overview/features.md) overview page and explore the OpenMetadata UI.
2. Visit the [Connectors](../docs/integrations/connectors/) documentation to see what services you can integrate with OpenMetadata.
3. Visit the [API](../docs/openmetadata-apis/apis/overview.md) documentation and explore the OpenMetadata APIs.

## Enable Security

OpenMetadata has support for Google, Okta, Auth0, Azure SSO, and custom OIDC as identity providers. Please check [Secure OpenMetadata](../docs/deploy/secure-openmetadata/) for configuring Single Sign On.

{% content-ref url="../docs/deploy/secure-openmetadata/" %}
[secure-openmetadata](../docs/deploy/secure-openmetadata/)
{% endcontent-ref %}