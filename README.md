<div style="display:flex;justify-content:center;">
    <img src="./katara.png" height="100" />
</div>

# Project Katara
Katara is a free web application that uses NASA's satellites data for giving to users a better understandment of the path of water across the entire Earth system and how the availability of this critical resource is affected by our changing climate through an interactive application. 

## Features

The Web App Katara's interactive experience is based on a Language Model and an open-source planetary globe engine. The LM responds to user's questions about the water with geographic information in texts and on an interactive 3D globe. 

- [WorldWindJs](https://github.com/WorldWindEarth/worldwindjs) - used for displaying the interactive 3D globe, which is a fork of an open-source planetary globe engine, the [Web WorldWind](https://worldwind.arc.nasa.gov/web/) platform.

- [Llama 2](https://huggingface.co/docs/transformers/main/model_doc/llama2) - llama 2 pretrained model, with average 7 billion parameters as a base, was used for building Katara LLM, however it was fine-tuned using NASA datasets and documents to answer Earth's water related questions.
  
<div style="display:flex;justify-content:center;">
    <img src="./app_img.png" height="500"/>
</div>
</br>

***

# React + Vite
This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

***

# References
All of the sources that helped building the project, such as datasets, documents and libraries, are listed as a reference.

## Repositories

- [Web WorldWind](https://worldwind.arc.nasa.gov/web/)
- [WorldWindJs](https://github.com/WorldWindEarth/worldwindjs)
  
## Documents

- [Accelerated sea ice loss in the Wandel Sea points to a change in the Arctic’s Last Ice Area](https://www.nature.com/articles/s43247-021-00197-5)
- [Arctic Report Card](https://arctic.noaa.gov/Report-card/)
- [Arctic Sea Ice 6th Lowest on Record; Antarctic Sees Record Low Grow...](https://climate.nasa.gov/news/3284/arctic-sea-ice-6th-lowest-on-record-antarctic-sees-record-low-growth/)
- [Arctic Sea Ice Minimum | NASA Global Climate Chang](https://climate.nasa.gov/vital-signs/arctic-sea-ice/)
- [Carbon Dioxide Concentration](https://climate.nasa.gov/vital-signs/carbon-dioxide/)
- [Climate Change Evidence: How Do We Know?](https://climate.nasa.gov/evidence/)
- [Global Surface Temperature](https://climate.nasa.gov/vital-signs/global-temperature/)
- [Ice Sheets | NASA Global Climate Change](https://climate.nasa.gov/vital-signs/ice-sheets/)
- [Improving health and reducing poverty through water safety and quality](https://www.who.int/activities/improving-water-safety)
- [Llama 2](https://huggingface.co/docs/transformers/main/model_doc/llama2)
- [Methane | Vital Signs](https://climate.nasa.gov/vital-signs/methane/)
- [NASA Climate Kids](https://climatekids.nasa.gov/carbon/)
- [NASA Global Climate Change: Sustainability and Government Resources](https://climate.nasa.gov/solutions/resources/)
- [Ocean Heat Content | NASA Global Climate Change](https://climate.nasa.gov/vital-signs/ocean-warming/)
- [Overview | Mission - AIRS](https://airs.jpl.nasa.gov/mission/overview/)
- [PIOMAS Artic Sea Ice Volume Reanalysis](http://psc.apl.uw.edu/research/projects/arctic-sea-ice-volume-anomaly/)
- [Solimões and Negro Rivers](https://www.nasa.gov/image-article/solim%C3%B5es-negro-rivers/)
- [The Causes of Climate Change](https://climate.nasa.gov/causes/)
- [The Effects of Climate Change](https://climate.nasa.gov/effects/)
- [Water, sanitation and hygiene (WASH)](https://www.who.int/health-topics/water-sanitation-and-hygiene-wash)