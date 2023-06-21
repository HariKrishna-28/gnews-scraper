import puppeteer from 'puppeteer';
import serializeURL from './serializeUrl.js';
import type {Options,NewsData,ElementType} from '../types/types';


async function scraper(config:Options):Promise<NewsData[]>{
    const browser = await puppeteer.launch({args:["--incognito","--no-sandbox","--single-process","--no-zygote",'--disable-dev-shm-usage',"--disable-setuid-sandbox"]});
    const page = await browser.newPage();

    const url:string=serializeURL(config);
    await page.goto(url,{'waitUntil':'domcontentloaded'});
  
    await page.setViewport({width: 1080, height: 1024});
  
    var newsData:NewsData[]=await page.evaluate(()=>{
      
      var data:NewsData[]=[];
  
      var divNode= document.querySelectorAll('div[class="NiLAwe y6IFtc R7GTQ keNKEd j7vNaf nID9nc"]');
  
      divNode.forEach((node)=>{
          var title:ElementType=node.querySelector('h3[class="ipQwMb ekueJc RD0gLb"]>a')?.textContent;
          var articleUrl:ElementType=node.querySelector('a[class="VDXfz"]')?.getAttribute('href')?.replace('.','https://news.google.com');
          var sourceName:ElementType=node.querySelector('a[class="wEwyrc"]')?.textContent;
          var imageUrl:ElementType=node.querySelector('img[class="tvs3Id QwxBBf"]')?.getAttribute('src');
          var time:ElementType=node.querySelector('time[class="WW6dff uQIVzc Sksgp slhocf"]')?.textContent;
  
          if(title&&articleUrl&&sourceName&&imageUrl&&time){
            data.push({
              title,articleUrl,sourceName,imageUrl,time
            })
          };
      })
  
      return data;
    })
  
    await browser.close();
   
    return newsData;
}

export default scraper;