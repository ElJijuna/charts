# Roadmap de @real-native/charts

Actualizado: 2026-10-04. `[x]` indica completado; `[ ]` indica pendiente.
La librería tiene prioridad. Los elementos de **Stories** son secundarios salvo
cuando sirven para verificar una corrección de la librería.

## Completado: librería

- [x] Ofrecer 17 tipos de gráficos con primitivas de RN, Victory Native y Skia.
- [x] Exportar builds CommonJS y ESM, tipos TypeScript y fuentes para Metro.
- [x] Conservar la inferencia de claves genéricas de los componentes al usar `React.memo`.
- [x] Estabilizar datos preparados, claves de series, tema y opciones de ejes.
- [x] Evitar volver a preparar datos cartesianos cuando cambia el tema.
- [x] Compartir la configuración de animación y estabilizar esquinas y colores de velas.
- [x] Estabilizar las divisiones de series de Combo y la serie interna de Histogram.
- [x] Calcular los bins de Histogram según los extremos del dominio, no su referencia.
- [x] Evitar renders con props estables, sin comparaciones profundas de datasets.
- [x] Manejar datos vacíos y series sin valores utilizables sin montar el renderer.
- [x] Filtrar X inválidas y tratar Y inválidas como datos ausentes, sin mutar el dataset.
- [x] Exigir muestras finitas completas en Bubble, Candlestick y AreaRange.
- [x] Mostrar un único punto válido en Line, Area, Sparkline y series de línea de Combo.
- [x] Mostrar extremos únicos de AreaRange y valores acumulados de StackedArea.
- [x] Manejar series constantes y ceros, además de limitar configuraciones de Histogram.
- [x] Filtrar porciones inválidas de Pie y manejar sumas que exceden el rango numérico.
- [x] Mantener el ajuste de valores inválidos y fuera de rango de Gauge.
- [x] Exportar el hook reutilizable `useChartPointSelection` en la API local de la librería.
- [x] Agrupar solicitudes de selección en una actualización por frame.
- [x] Evitar actualizar estado al seleccionar repetidamente el mismo punto.
- [x] Cancelar trabajo pendiente de selección al desmontar el componente.
- [x] Documentar actualizaciones inmutables, props estables y uso del hook de selección.
- [x] Incorporar pruebas de casos extremos, estabilidad de renders y selección por frame.

## Completado: Stories y validación web

- [x] **Stories:** levantar, compilar y previsualizar Storybook desde la raíz.
- [x] **Stories:** corregir carga de dependencias, transformación de worklets y CanvasKit web.
- [x] **Stories:** mostrar recompensas con Line y Area en una tarjeta pequeña y transparente.
- [x] **Stories:** seleccionar semana, mes y año, con totales y etiquetas de cada período.
- [x] **Stories:** separar el gráfico del tooltip y mantener el estado en la capa de interacción.
- [x] **Stories:** ajustar el ancho mediante `onLayout` del contenedor, sin usar el de la ventana.
- [x] **Stories:** mostrar valores por hover, foco, toque y arrastre táctil.
- [x] **Stories:** conservar el último valor al soltar el toque y limitar el tooltip al contenedor.
- [x] **Stories:** estabilizar zonas de interacción y normalizar coordenadas táctiles RN/Web.
- [x] **Stories:** permitir scroll vertical en web y reservar el arrastre horizontal para selección.
- [x] **Stories:** cubrir los 17 gráficos con ejemplos vacíos, únicos, inválidos y constantes.
- [x] **Validación:** 60 tests unitarios pasan en la revisión actual.
- [x] **Validación:** los 38 flujos web existentes pasaron antes del último cambio del tooltip.
- [x] **Validación:** los 4 flujos de Rewards pasaron tras ese cambio, en 320 y 1024 px.
- [x] **Validación:** lint, TypeScript y builds de librería y Storybook pasan.

Estas comprobaciones web y unitarias no sustituyen ejecutar la app en iOS y Android.

## Prioridad 0: cerrar la preparación de publicación

El artefacto se puede empaquetar, pero el flujo automático de release no está listo.
No se reducen los requisitos de calidad para declarar la publicación preparada.

- [x] Revisar nombre, licencia MIT, metadatos, `publishConfig.access` y exports.
- [x] Crear y revisar un tarball real con `npm pack`, después del build.
- [x] Verificar que todos los entry points y sus imports relativos existen dentro del tarball.
- [x] Verificar que se incluyen tipos, fuentes y licencia, y se excluyen tests y ejemplos.
- [x] Comprobar los tipos del tarball en consumidores ESM y CommonJS con TypeScript NodeNext.
- [x] Comprobar en esos consumidores que una clave inexistente sigue siendo un error de tipos.
- [x] Ejecutar `npm publish --dry-run --access public` para el artefacto actual `0.0.0`.
- [x] Consultar el registro público: devuelve E404 para `@real-native/charts` en esta revisión.
- [ ] Instalar también `example` con `npm --prefix example ci` en CI y Release antes de typecheck.
- [ ] Excluir `.expo`, `storybook-static`, `test-results` y `playwright-report` de Biome.
- [ ] Corregir los errores de formato y reglas de Biome que permanezcan en archivos propios.
- [ ] Excluir documentos generados de Expo y resultados de pruebas de `lint:md`.
- [ ] Elevar la cobertura de ramas al 90% exigido mediante pruebas de comportamiento útiles.
- [ ] Repetir todas las comprobaciones de los workflows y confirmar que pasan.
- [ ] Probar el tarball en apps consumidoras RN y Web sin el alias local a `src` del ejemplo.
- [ ] Verificar las versiones mínimas declaradas y publicar una matriz de compatibilidad probada.
- [ ] Documentar instalación web: RN Web, GestureHandlerRootView y carga de Skia/CanvasKit.
- [ ] Documentar instalación nativa y diferencias de configuración de Reanimated 3 y 4.
- [ ] Considerar `prepack: npm run build` para que `npm pack` no dependa de un build manual previo.
- [ ] Elegir la primera versión y completar sus notas en CHANGELOG; actualmente figura `0.0.0`.
- [ ] Decidir entre release manual y semantic-release, evitando dos publicaciones del mismo cambio.
- [ ] Verificar que semantic-release mantiene `package-lock.json` junto con `package.json`.
- [ ] Confirmar permisos del usuario sobre el scope `@real-native` y autenticación de publicación.
- [ ] Verificar credenciales o configurar trusted publishing para el workflow de Release.
- [ ] Ejecutar el dry-run de publicación con la versión final y revisar su contenido.
- [ ] Publicar en npm y comprobar instalación de la versión publicada en apps consumidoras.

### Resultado de la revisión actual

- Tarball `real-native-charts-0.0.0.tgz`: 296 archivos, 58.868 bytes comprimidos.
- Sin dependencias runtime empaquetadas; los motores de gráficos son peer dependencies.
- `lint`, `typecheck`, los 60 tests, `build` y el dry-run de publicación: correctos.
- `test:coverage`: 99,21% de sentencias, 99,12% de líneas y 100% de funciones.
- Cobertura de ramas: **87,02%**; incumple el mínimo global del 90% y falla el comando.
- `format:check`: falla, incluye archivos generados y detecta diferencias en archivos propios.
- `lint:md`: falla por `example/.expo/README.md`, que es un archivo generado.
- CI y Release solo instalan dependencias de la raíz, aunque typecheck también comprueba `example`.
- El E404 del registro no demuestra disponibilidad del scope ni permisos para publicar.
- No se han comprobado credenciales ni se ha ejecutado una publicación real.

## Prioridad 1: rendimiento con series grandes

- [ ] Medir preparación, render, memoria e interacción con 1.000, 10.000 y 50.000 puntos.
- [ ] Medir en Web y RN antes de introducir más memoización o cambiar algoritmos.
- [ ] Corregir `Math.min(...sizes)` y `Math.max(...sizes)` en Bubble para arrays grandes.
- [ ] Reducir recorridos y arrays temporales en Bubble y reutilizar sus datos ya normalizados.
- [ ] Revisar el escalado de radios de Bubble con rangos numéricos extremos y valores repetidos.
- [ ] Revisar asignaciones y recorridos repetidos en preparación, Histogram y gráficos apilados.
- [ ] Evitar cálculos acumulativos repetidos para marcadores de StackedArea.
- [ ] Evaluar simplificación opcional de puntos de Line/Area según el ancho disponible.
- [ ] Si se simplifica, conservar extremos, huecos y datos originales para seleccionar valores.
- [ ] Mantener el comportamiento actual por defecto y la API compatible RN/Web.
- [ ] Medir tamaño de distribución y bundle consumidor, incluyendo el efecto de tree shaking.
- [ ] Revisar animación con datasets grandes y ofrecer controles compatibles si las medidas lo piden.

## Prioridad 1: compatibilidad y accesibilidad

- [ ] Ejecutar gráficos y tooltip en dispositivos o simuladores iOS y Android.
- [ ] Verificar toque, arrastre, cancelación, scroll vertical, cambio de período y resize nativo.
- [ ] Verificar el comportamiento con Reanimated 3 y 4, y con las versiones RN/Expo soportadas.
- [ ] Probar Safari y Firefox, además de Chromium.
- [ ] Verificar navegación de puntos por teclado, incluidas flechas, Home, End y Escape.
- [ ] Definir cómo anunciar el valor seleccionado a lectores de pantalla sin exceso de avisos.
- [ ] Verificar VoiceOver, TalkBack, foco, tamaño de objetivos y contraste en fondos variables.
- [ ] Respetar la preferencia de movimiento reducido cuando haya animaciones.
- [ ] Evaluar una capa de tooltip reutilizable que use geometría real del gráfico.
- [ ] Para esa capa, verificar selección con dominios no uniformes, varias series y datos ausentes.
- [ ] Añadir ejemplos de reinicio de selección al cambiar los datos sin remontar el overlay.

## Prioridad 2: Stories y mantenimiento

- [ ] **Stories:** ejemplos de datasets grandes para repetir mediciones de rendimiento.
- [ ] **Stories:** herramienta de diagnóstico de renders separada de la interfaz del ejemplo.
- [ ] **Stories:** ejemplos de tooltip con varias series y dominios no uniformes.
- [ ] **Stories:** estados de carga y vacío configurables, si se añaden a la API de la librería.
- [ ] **Stories:** verificar fondos oscuros y contenedores más estrechos que el tooltip.
- [ ] **Stories:** revisar división de chunks y advertencias de tamaño del build web.
- [ ] **Mantenimiento:** integrar las pruebas web en CI cuando estén resueltos sus checks actuales.
- [ ] **Mantenimiento:** automatizar la comprobación del tarball y los tipos consumidores.
- [ ] **Mantenimiento:** registrar presupuesto de rendimiento y tamaño para futuras regresiones.

## Comandos de publicación manual

Ejecutar desde la raíz con Node compatible con `engines`. Resolver primero los checks pendientes.
La versión `0.1.0` es una propuesta para la primera entrega, no una modificación ya aplicada.

```sh
npm ci
npm --prefix example ci
npm run lint
npm run format:check
npm run lint:md
npm run typecheck
npm run test:coverage -- --runInBand
npm run storybook:build
npm run test:e2e
```

Solo si todas las comprobaciones pasan y se elige publicación manual:

```sh
npm version 0.1.0 --no-git-tag-version
npm run build
npm pack --dry-run
npm publish --dry-run --access public
npm login
npm whoami
npm publish --access public
npm view @real-native/charts version
```

Actualizar CHANGELOG antes del build final. Revisar y guardar los cambios de versión.
`prepublishOnly` recompila al publicar, pero no ejecuta por sí solo los checks anteriores.
El dry-run no verifica permisos de publicación. Para el scope se necesitan permisos npm;
la publicación interactiva requiere la autenticación y 2FA que solicite el registro.

Si se elige semantic-release, dejar que gestione la versión y ejecutar la publicación a
través del workflow de Release después de corregir sus checks y configurar autenticación.
No ejecutar en paralelo la secuencia manual sobre el mismo cambio.

Fuentes: [publicación de paquetes scoped][npm-scoped], [npm publish][npm-publish],
[scripts de npm][npm-scripts], [versionado][npm-version] y [autenticación 2FA][npm-2fa].

[npm-scoped]: https://docs.npmjs.com/creating-and-publishing-scoped-public-packages/
[npm-publish]: https://docs.npmjs.com/cli/commands/npm-publish/
[npm-scripts]: https://docs.npmjs.com/misc/scripts/
[npm-version]: https://docs.npmjs.com/cli/commands/npm-version/
[npm-2fa]: https://docs.npmjs.com/requiring-2fa-for-package-publishing-and-settings-modification/
