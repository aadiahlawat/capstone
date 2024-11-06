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
const  createArticleElement = ({image, title, description,path}) =>
{
    const articleContent = document.createElement('div');
    articleContent.classList.add('article-container')
    
    const articleImage = document.createElement('img'); // Create an img element
    articleImage.src = image; // Set the image source 
    articleImage.alt = title;
    articleContent.appendChild(articleImage);
    

    const articleTitle = document.createElement('a'); // Create an a element
    articleTitle.href = path; 
    articleTitle.textContent = title;

    articleContent.appendChild(articleTitle);

    const articleDescription = document.createElement('p'); 
    articleDescription.textContent = description;
    articleContent.appendChild(articleDescription);

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

    block.append(articleWrapper);
}
export default async function decorate(block) {

        const currentPage=1;
        const articlesPerPage=5;
        const link = block.querySelector('a');
        const path = link ? link.getAttribute('href') : block.textContent.trim();
        const articles=await fetchArticles(path,articlesPerPage,currentPage);
        
        renderData(block,articles);
}
