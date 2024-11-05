import { createOptimizedPicture } from '../../scripts/aem.js';
function loadCategoriesTab()
{
/************  Categories code ****************/
const adventuresCategoriesList=document.querySelector(".adventures-categories ul");
const adventuresContent=document.querySelector(".adventures-outer");
const adventuresArticles = adventuresContent.querySelectorAll('article');
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
    console.log("Current Categorie is:  "+ currentCategory);
    adventuresCategories.forEach(li => li.classList.remove('active-category'));
    // Add the class to the currently clicked <p> element
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
    const toggleCategory='adventure-'+category;
    console.log('toggle category : '+toggleCategory);
    adventuresArticles.forEach((article, i) => {
      const articleCategory=article.getAttribute('data-category');
      console.log('article category : '+articleCategory);
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

async function fetchadventures(block,path,adventuresPerPage,currentPage) {
  try {
  const offset=(currentPage-1)*adventuresPerPage;
  let adventuresPath=path+"?offset="+offset+"&limit="+adventuresPerPage;
  const response = await fetch(adventuresPath); // Replace with your JSON URL
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
  const adventures=data.data;



  const adventureCategoriesContainer = document.createElement('div');
  adventureCategoriesContainer.classList.add('adventures-categories');

  const adventureCategoriesList = document.createElement('ul');

  const allCategoriesFilter='<li data-category="all" class="all"><span>All</span></li>';
  adventureCategoriesList.insertAdjacentHTML('afterbegin',allCategoriesFilter);

  let adventureCategoriesArray=new Set();

  // create set for categories
  adventures.forEach(adventure => {
   adventureCategoriesArray.add(adventure.Category);
  });

  adventureCategoriesArray.forEach(adventureCategoryName => {
    const adventureCategoryContainer=document.createElement('li');
    adventureCategoryContainer.setAttribute('data-category',adventureCategoryName.toLowerCase().replace(/\s+/g, '-'));
    const adventureCategory = document.createElement('span'); 
    adventureCategory.textContent=adventureCategoryName;
    adventureCategoryContainer.appendChild(adventureCategory);
    // append li to ul
    adventureCategoriesList.appendChild(adventureCategoryContainer);
  });
  // append ul to the categories wrapper
  adventureCategoriesContainer.appendChild(adventureCategoriesList);
  block.append(adventureCategoriesContainer);


  const adventureWrapper = document.createElement('div');
  adventureWrapper.classList.add('adventures-outer')
  const totaladventures=data.total;
  adventureWrapper.setAttribute('data-totaladventures',totaladventures);

  // Render the list adventures
  adventures.forEach(adventure => {

    const adventureContent = document.createElement('article');
    adventureContent.setAttribute('data-category','adventure-'+adventure.Category.toLowerCase().replace(/\s+/g, '-'));
    adventureContent.classList.add('adventure-'+adventure.Category.toLowerCase().replace(/\s+/g, '-'));

      const adventureImageContainer=document.createElement('div');
      adventureImageContainer.classList.add('adventure-image-container');
      const adventureImage = document.createElement('img'); // Create an img element
      adventureImage.src = adventure.Image; // Set the image source (replace with your image URL)
      adventureImage.alt = adventure.Title;

      adventureImageContainer.appendChild(adventureImage);
      adventureContent.appendChild(adventureImageContainer);
      

      const adventureTitleContainer=document.createElement('div');
      adventureTitleContainer.classList.add('adventure-title-container');
      const adventureTitle = document.createElement('a'); // Create an a element
      adventureTitle.href = "adventures/"+adventure.Title.toLowerCase().replace(/\s+/g, '-'); 
      adventureTitle.textContent = adventure.Title;

      adventureTitleContainer.appendChild(adventureTitle);
      adventureContent.appendChild(adventureTitleContainer);

      const adventureDescriptionContainer=document.createElement('div');
      adventureDescriptionContainer.classList.add('adventure-description-container');
      const adventureDescription = document.createElement('p'); // Create an a element
      adventureDescription.textContent = adventure.Description;

      adventureDescriptionContainer.appendChild(adventureDescription);
      adventureContent.appendChild(adventureDescriptionContainer);
      adventureWrapper.appendChild(adventureContent);

  });
  adventureWrapper.querySelectorAll('img').forEach((img) => img.replaceWith(createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }])));
  block.querySelector('div').style.display = 'none'; ;

  block.append(adventureWrapper);
}
/*
function renderPagination(block,path,adventuresPerPage,totaladventures,currentPage)
{
  const totalPages=Math.ceil(totaladventures/adventuresPerPage);
  const pagination=document.createElement('ul');
  pagination.classList.add('adventures-pagination');
  pagination.innerHTML='';
  for(let i=1;i<=totalPages;i++)
  {
      const li=document.createElement('li');
      li.textContent=i;
      //li.classList.add(i===currentPage ? 'active' : '');
      li.addEventListener('click',() =>{
          currentPage=i;
          paginate(block,path,adventuresPerPage,totaladventures,currentPage);
      });
      pagination.appendChild(li);
  }
  block.append(pagination);
} 
async function paginate(block,path,adventuresPerPage,totaladventures,currentPage)
{
  fetchadventures(block,path,adventuresPerPage,currentPage);
}*/
export default async function decorate(block) {
      let currentPage=1;
      const adventuresPerPage=20;
      const link = block.querySelector('a');
      const path = link ? link.getAttribute('href') : block.textContent.trim();
      const adventures=await fetchadventures(block,path,adventuresPerPage,currentPage);
      const totaladventures=block.querySelector('.adventures-outer').getAttribute('data-totaladventures');
      //renderPagination(block,path,adventuresPerPage,totaladventures,currentPage);
      loadCategoriesTab();
}
