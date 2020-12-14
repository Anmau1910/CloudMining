# CloudMining: Visualización de Datos *Serverless*

*Aplicación [aquí](http://cloudminingfront.s3-website-us-east-1.amazonaws.com/).*

*Repositorio del front-end [aquí](https://github.com/Anmau1910/CloudMiningFront).*

CloudMining es un servicio web de visualización de datos basado en la nube. El objetivo de este proyecto es explorar la implementación de un servicio web *serverless*, evitando el provisionamiento de infraestructura y los costos asociados con la manutención de esta. De esta manera, se ha creado una aplicación web cuyo poder de procesamiento es escalable a un gran número de peticiones sin necesidad de adjudicar recursos humanos al mantenimiento constante de un servidor o una flota de servidores dedicados al servicio de dichas peticiones.
Simultáneamente, se examina una de las prácticas ubicuas en DevOps: el despliegue continuo o *continuous deployment*, basado también en servicios en la nube de Amazon como soporte para la automatización de la construcción y el despliegue automático del componente *front-end*.
A continuación se encuentra un análisis de la arquitectura y las decisiones de diseño que fueron tomadas, así como las dificultades y aspectos a mejorar para próximas iteraciones de este proyecto o proyectos similares:

## Arquitectura

El servicio web, como muchos otros, puede ser dividido en tres servicios:

- front-end: aplicación distribuida a través de HTTPS, contiene la interfaz de usuario y hace uso del servicio de back-end para procesar la data indicada. Este servicio hace uso del *hosting* de páginas web estáticas provista por Amazon S3, gracias a su facilidad de configuración e integración con AWS CodePipeline. El uso de Amazon Lightsail fue considerado, pero debido a las limitaciones de la cuenta de AWS utilizada, no fue posible probar esta implementación.
- back-end: hace uso de funciones de AWS Lambda como unidades de procesamiento. En este servicio se aloja el código utilizado para generar las gráficas solicitadas, exponiendo recursos a través de una API REST facilitada por Amazon API Gateway con el uso de Lambda Proxy Integration. A su vez, este utiliza el servicio de almacenamiento de datos, detallado a continuación.
- Almacenamiento de datos: basado en Amazon S3, es utilizado para proveer almacenamiento y distribución de gráficas generadas, así como el almacenamiento de *datasets* en formato CSV provistos por los usuarios. Al momento de expandir la funcionalidad del servicio, se estudiaría el almacenamiento en servicios de bases de datos en vez de almacenamiento de objetos.

## Desarrollo

El corazón de la aplicación web es el servicio de back-end, que utiliza Python 3.7 junto a los módulos `pandas` y `matplotlib` para la carga de datos y la fabricación de gráficas. Una vez definido el flujo básico de datos, se crearon las funciones necesarias para dar soporte a gráficos de tipo *scatter plots*, *bar plots*, *density plots* y *box plots*. En principio, las funciones en AWS Lambda solo deben cargar un *dataframe* con `pandas` en memoria, generar las gráficas con `matplotlib` y luego almacenarlas.

La primera dificultad afrontada fue la no existencia de capas o *layers* que proveen los módulos previamente mencionados. En consecuencia, fue necesario descargar localmente todas las dependencias, comprimirlas en un archivo `.zip`, y cargarlas como una capa personalizada. El proceso se hizo una única vez y fue igual para todas las funciones implementadas con la excepción de la función encargada de generar los *density plots*, que tienen una dependencia adicional en el módulo `scipy`. Este módulo sí es provisto por una capa precargada en AWS Lambda, así que la integración no fue complicada.

El siguiente paso es definir la fuente de los datos. Debido a que los *datasets* serían almacenados como objetos en un *bucket* de Amazon S3, es necesario adjudicarle un rol de AWS IAM a cada una de las funciones que permita el acceso de lectura a *buckets* de S3. Una vez configurado este rol de acceso, se configuran las variables de entorno en AWS Lambda para acceder al *bucket* designado, y se utiliza el módulo `boto3` para recuperar objetos almacenados en este.
Por último, para poder acceder a estos servicios desde fuera de la nube de Amazon, se decide exponer los mismos a través de una API REST, utilizando Lambda Proxy Integration de Amazon API Gateway. Cada recurso en esta API se corresponde con una función de AWS Lambda, manejando así cada solicitud y reenviando datos como parámetros de consulta y, en caso de solicitudes con el método POST de HTTP, el cuerpo de estas. Todos estos datos son expuestos en el parámetro `event` que recibe cada función Lambda.

Para manejar la carga de datos de parte del usuario, se observan dos avenidas factibles: la integración directa de API Gateway a S3, y el uso de una función de AWS Lambda como intermediario. Debido a que preferimos que se analizara la validez de la data ingresada antes de ser almacenada, se decidió tomar la segunda vía. Configurando el tipo de media que acepta este recurso como `multipart/form-data`, API Gateway actúa como intermediario y envía la data cruda a una función AWS Lambda, que se encarga de analizar esta data, guardarla en un archivo, verificar su validez con `pandas` y luego almacenarla en S3. Esto, por supuesto, limita el tamaño de los *datasets* que pueden ser cargados y analizados, y para futuras implementaciones se estudiarán otras opciones.

### Despliegue contínuo

Debido al hecho de que la aplicación web escrita para el *front-end* utiliza Angular como *framework* de desarrollo, la puesta en producción de la misma se ejecuta en dos fases: la fase de compilación, donde el proyecto se compila de Typescript a Javascript y se generan los artefactos finales, y la fase de despliegue, donde estos artefactos son cargados en un servidor donde se sirven como archivos estáticos. Esto nos brindó la oportunidad de crear un sistema de despliegue contínuo de baja complejidad, perfecta como introducción a este tipo de técnicas de DevOps.

Utilizando AWS CodePipeline, se crea un *pipeline* de despliegue de tres fases:
- **Source**: la fuente del código es un repositorio alojado en GitHub. AWS provee un *webhook* que es ejecutado cuando se actualiza la rama *main*. Este *webhook* carga el código y comienza la ejecución de la siguiente fase del *pipeline*.
- **Build**: basado en AWS CodeBuild, en esta fase ocurre la compilación del proyecto siguiendo lo indicado en el archivo `buildspec.yml`, que define tres fases:
    - `install`: donde se instala `nodejs`, bloque básico en la construcción de la aplicación web, en un sistema Ubuntu Linux.
    - `pre-build`: donde se usa el manejador de paquetes de `nodejs`, `npm`, para descargar dependencias adicionales, como el framework `angular` y sus utilides.
    - `build`: donde se compila finalmente el proyecto, para generar los artefactos a desplegar.
- **Deploy**: en esta última fase, los artefactos generados por la fase anterior son cargados en un *bucket* S3 preconfigurado para servir una página web estática.

## Siguientes pasos

Gracias a las lecciones aprendidas durante el desarrollo de este proyecto, se contemplan los siguientes pasos para continuar el crecimiento profesional en esta área:
- Expandir conocimientos a otros servicios en la nube de Amazon: más allá de AWS Lambda, servicios como Amazon SageMaker permitirían la utilización de recursos en la nube para crear, entrenar y desplegar modelos de *machine-learning*, llevándonos un paso más adelante de las funcionalidades provistas actualmente. Adicionalmente, la exploración de productos como Amazon DynamoDB u otros mecanismos de almacenamiento de datos podría arrojar posibilidades de crecimiento en el futuro.
- Aumentar la automatización del desarrollo y el despliegue: luego de la exitosa integración de AWS CodePipeline en nuestro flujo de desarrollo para el servicio de *front-end*, el siguiente paso debe la implementación de pruebas unitarias, para detectar posibles regresiones luego de cada actualización. El estudio de AWS CloudFormation podría incluso proveer alternativas para el despliegue automático de funciones a AWS Lambda, así como la configuración de políticas de acceso a *buckets* y otros detalles de configuración que actualmente se ejecutan manualmente en la consola web.
