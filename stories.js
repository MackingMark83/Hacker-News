"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDButton = false) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
 //my work
  let  showStar = Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${showDButton ? getDButtonHTML() : ''}
      ${showStar ? getStarHTML(story, currentUser) : ''}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
// my work 
//had to look at solutin
function getDButtonHTML(){
  return `<span class="trash-can">
  <i class="fas fa-trash-alt"></i>
</span>`;
}

function getStarHTML(story, user) {
  const isFavorite = user.isFavorite(story);
  const starType = isFavorite ? "fas" : "far";
  return `
      <span class="star">
        <i class="${starType} fa-star"></i>
      </span>`;
}
// Had to look at some of the solution but did ok with figuring it out on my own
//my work
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  ownStories.empty();

  if (currentUser.ownStories.length === 0) {
    ownStories.append("<h5>No stories added by user yet!</h5>");
  } else {

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
}
   ownStories.show();
}

//Favorites 

function putFavoritesListOnPage() {
  console.debug("putFavoritesListOnPage");

  favoritedStories.empty();

  if (currentUser.favorites.length === 0) {
    favoritedStories.append("<h5>No favorites added!</h5>");
  } else {
    // loop through all of users favorites and generate HTML for them
    for (let story of currentUser.favorites) {
      const $story = generateStoryMarkup(story);
      favoritedStories.append($story);
    }
  }

  favoritedStories.show();
}

// favorite/un-favorite a story 
// Had to look at solution
async function toggleStoryFavorite(evt) {
  console.debug("toggleStoryFavorite");

  const $tgt = $(evt.target);
  const $closestLi = $tgt.closest("li");
  const storyId = $closestLi.attr("id");
  const story = storyList.stories.find(s => s.storyId === storyId);

  // see if the item is already favorited (checking by presence of star)
  if ($tgt.hasClass("fas")) {
    // currently a favorite: remove from user's fav list and change star
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  } else {
    // currently not a favorite: do the opposite
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$storiesLists.on("click", ".star", toggleStoryFavorite);
