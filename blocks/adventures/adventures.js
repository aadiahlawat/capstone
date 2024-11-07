import { createOptimizedPicture } from '../../scripts/aem.js';

const loadCategoriesTab = () =>
{
/************  Categories code ****************/
const adventuresCategoriesList=document.querySelector(".adventures-categories ul");
const adventuresContent=document.querySelector(".adventures-outer");
const adventuresArticles = adventuresContent.querySelectorAll('div');
const adventuresCategoriesFirst=adventuresCategoriesList.querySelector('li:first-child');
if(adventuresCategoriesFirst)
{
  adventuresCategoriesFirst.classList.add('active-category');
}

const adventuresCategories=adventuresCategoriesList.querySelectorAll('li');
adventuresCategories.forEach((category)=>
{
  category.onclick=function()
  {
    const currentCategory=this.getAttribute('data-category');
    adventuresCategories.forEach(li => li.classList.remove('active-category'));
    // Add the class to the currently clicked  element
    category.classList.add('active-category');
    toggleAdventureByCategory(currentCategory);
  }
});
// Function to toggle a Categorie  by class
function toggleAdventureByCategory(category) {
  if(category==="all" || category==="adventure-all" )
  {
    adventuresArticles.forEach((article, i) => {
          article.style.display = 'block'; // show all items
  });
  }
  else
  {
    const toggleCategory=`adventure-${category}`;
    adventuresArticles.forEach((article, i) => {
      const articleCategory=article.getAttribute('data-category');
      if (articleCategory === toggleCategory) {
          article.style.display = 'block'; // Show the item
      } else {
        article.style.display = 'none'; // Hide other items
      }
  });
  }
}
}


// fetch adventures form adventures.json

const fetchadventures = async (path,adventuresPerPage,currentPage) => {
  try {
  const offset=(currentPage-1)*adventuresPerPage;
  let adventuresPath=`${path}?offset=${offset}&limit=${adventuresPerPage}`;
  const response = await fetch(adventuresPath); // Replace with your JSON URL
  if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
} 
  catch (error) {
    return { data: [], total: 0 };
  }
}



// render adventures
const renderAdventures = ({Image,Title,Description,Category})=>
{
  
  const adventureContent = document.createElement('div');
  adventureContent.setAttribute('data-category','adventure-'+Category.toLowerCase().replace(/\s+/g, '-'));

    const adventureImage = document.createElement('img'); // Create an img element
    adventureImage.src = Image; // Set the image source (replace with your image URL)
    adventureImage.alt = Title;

    adventureContent.appendChild(adventureImage);
    

    const adventureTitle = document.createElement('a'); // Create an a element
    adventureTitle.href = `adventures/${Title.toLowerCase().replace(/\s+/g, '-')}`; 
    adventureTitle.textContent = Title;

    adventureContent.appendChild(adventureTitle);

    const adventureDescription = document.createElement('p'); // Create an a element
    adventureDescription.textContent = Description;

    adventureContent.appendChild(adventureDescription);
    return adventureContent
}


// render categories
const renderCategories = (adventureCategoryName) =>
{
  const adventureCategoryContainer=document.createElement('li');
  adventureCategoryContainer.setAttribute('data-category',adventureCategoryName.toLowerCase().replace(/\s+/g, '-'));
  adventureCategoryContainer.textContent=adventureCategoryName;
  return adventureCategoryContainer;
}


//render output
const  renderData = (block,data)  =>
{  

  const adventureCategoriesContainer = document.createElement('div');
  adventureCategoriesContainer.classList.add('adventures-categories');

  const adventureCategoriesList = document.createElement('ul');

  const allCategoriesFilter='<li data-category="all" >All</li>';
  adventureCategoriesList.insertAdjacentHTML('afterbegin',allCategoriesFilter);

  let adventureCategoriesArray=new Set();

  // create set for categories
  data.data.forEach(adventure => {
   adventureCategoriesArray.add(adventure.Category);
  });

  adventureCategoriesArray.forEach(adventureCategoryName => {
    
  adventureCategoriesList.appendChild(renderCategories(adventureCategoryName));
  });
  // append ul to the categories wrapper
  adventureCategoriesContainer.appendChild(adventureCategoriesList);


  const adventureWrapper = document.createElement('div');
  adventureWrapper.classList.add('adventures-outer')
  const totaladventures=data.total;

  // Render the list adventures
  data.data.forEach(adventure => {

    adventureWrapper.appendChild(renderAdventures(adventure));

  });
  adventureWrapper.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.textContent = '';
  block.append(adventureCategoriesContainer);
  block.append(adventureWrapper);
}


export default async function decorate(block) {
      let currentPage=1;
      const adventuresPerPage=20;
      const link = block.querySelector('a');
      const path = link ? link.getAttribute('href') : block.textContent.trim();
      const adventures=await fetchadventures(path,adventuresPerPage,currentPage);
      renderData(block,adventures);
      const totaladventures=block.querySelector('.adventures-outer').getAttribute('data-totaladventures');
      loadCategoriesTab();
}
