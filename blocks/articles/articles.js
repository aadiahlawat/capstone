import { createOptimizedPicture } from '../../scripts/aem.js';
async function fetchArticles(block,path,articlesPerPage,currentPage) {
    try {
    const offset=(currentPage-1)*articlesPerPage;
    let articlesPath=path+"?offset="+offset+"&limit="+articlesPerPage;
    const response = await fetch(articlesPath); // Replace with your JSON URL
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    renderData(block,data);
} 
    catch (error) {
        return [];
    }
}

function renderData(block,data)  
{  
    const articleWrapper = document.createElement('div');
    articleWrapper.classList.add('articles-outer')
    const articles=data.data;
    const totalArticles=data.total;
    articleWrapper.setAttribute('data-totalArticles',totalArticles);
    
    articles.forEach(article => {

        const articleContent = document.createElement('article');

        const articleImageContainer=document.createElement('div');
        articleImageContainer.classList.add('article-image-container');
        const articleImage = document.createElement('img'); // Create an img element
        articleImage.src = article.Image; // Set the image source (replace with your image URL)
        articleImage.alt = article.Title;

        articleImageContainer.appendChild(articleImage);
        articleContent.appendChild(articleImageContainer);
        

        const articleTitleContainer=document.createElement('div');
        articleTitleContainer.classList.add('article-title-container');
        const articleTitle = document.createElement('a'); // Create an a element
        articleTitle.href = "magazine/"+article.Title.toLowerCase().replace(/\s+/g, '-'); 
        articleTitle.textContent = article.Title;

        articleTitleContainer.appendChild(articleTitle);
        articleContent.appendChild(articleTitleContainer);

        const articleDescriptionContainer=document.createElement('div');
        articleDescriptionContainer.classList.add('article-description-container');
        const articleDescription = document.createElement('p'); // Create an a element
        articleDescription.textContent = article.Description;

        articleDescriptionContainer.appendChild(articleDescription);
        articleContent.appendChild(articleDescriptionContainer);
        articleWrapper.appendChild(articleContent);

    });
    block.querySelector('div').style.display = 'none'; 
    articleWrapper.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));

    block.append(articleWrapper);
}
/*
function renderPagination(block,path,articlesPerPage,totalArticles,currentPage)
{
    const totalPages=Math.ceil(totalArticles/articlesPerPage);
    const pagination=document.createElement('ul');
    pagination.classList.add('articles-pagination');
    pagination.innerHTML='';
    for(let i=1;i<=totalPages;i++)
    {
        const li=document.createElement('li');
        li.textContent=i;
        //li.classList.add(i===currentPage ? 'active' : '');
        li.addEventListener('click',() =>{
            currentPage=i;
            paginate(block,path,articlesPerPage,totalArticles,currentPage);
        });
        pagination.appendChild(li);
    }
    block.append(pagination);
} 
async function paginate(block,path,articlesPerPage,totalArticles,currentPage)
{
    fetchArticles(block,path,articlesPerPage,currentPage);
}*/
export default async function decorate(block) {
        let currentPage=1;
        const articlesPerPage=8;
        const link = block.querySelector('a');
        const path = link ? link.getAttribute('href') : block.textContent.trim();
        const articles=await fetchArticles(block,path,articlesPerPage,currentPage);
        const totalArticles=block.querySelector('.articles-outer').getAttribute('data-totalArticles');
       
        //renderPagination(block,path,articlesPerPage,totalArticles,currentPage);
}
