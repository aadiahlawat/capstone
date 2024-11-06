import { createOptimizedPicture } from '../../scripts/aem.js';

const fetchArticles = async (path,articlesPerPage,currentPage) => {
    try {
    const offset=(currentPage-1)*articlesPerPage;
    let articlesPath=`${path}?offset=${offset}&limit=${articlesPerPage}`;
    const response = await fetch(articlesPath); // Replace with your JSON URL
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();;
} 
    catch (error) {
        console.error('Error fetching articles:- ', error);
        return { data: [], total: 0 };
    }
}
const  createArticleElement = ({Image, Title, Description}) =>
{
    const articleContent = document.createElement('article');

    const articleImageContainer=document.createElement('div');
    articleImageContainer.classList.add('article-image-container');
    const articleImage = document.createElement('img'); // Create an img element
    articleImage.src = Image; // Set the image source 
    articleImage.alt = Title;

    articleImageContainer.appendChild(articleImage);
    articleContent.appendChild(articleImageContainer);
    

    const articleTitleContainer=document.createElement('div');
    articleTitleContainer.classList.add('article-title-container');
    const articleTitle = document.createElement('a'); // Create an a element
    articleTitle.href = `magazine/${Title.toLowerCase().replace(/\s+/g, '-')}`; 
    articleTitle.textContent = Title;

    articleTitleContainer.appendChild(articleTitle);
    articleContent.appendChild(articleTitleContainer);

    const articleDescriptionContainer=document.createElement('div');
    articleDescriptionContainer.classList.add('article-description-container');
    const articleDescription = document.createElement('p'); 
    articleDescription.textContent = Description;

    articleDescriptionContainer.appendChild(articleDescription);
    articleContent.appendChild(articleDescriptionContainer);
    return articleContent;
}
const renderData = (block,data) =>
{  
    const articleWrapper = document.createElement('div',);
    articleWrapper.classList.add('articles-outer');
    articleWrapper.setAttribute('data-totalArticles',data.total);
    
    data.data.forEach(article => {
        const articleContent=createArticleElement(article);
        articleWrapper.appendChild(articleContent);
    });

    // optimize the images
    articleWrapper.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
    
    block.querySelector('div').style.display = 'none'; 

    block.append(articleWrapper);
}
export default async function decorate(block) {

        const currentPage=1;
        const articlesPerPage=8;
        const link = block.querySelector('a');
        const path = link ? link.getAttribute('href') : block.textContent.trim();
        const articles=await fetchArticles(path,articlesPerPage,currentPage);
        
        renderData(block,articles);
}
