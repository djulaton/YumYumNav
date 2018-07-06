# YumYumNav

## Project 1: YumYumNav

**Team Memebers:**
```
- Catherine Chan 
- Diana Julaton
- Gabe Scoggin 
- Jobe Range
```

**Summary:**
Build a web site that will allow users to enter a city or zip code or restaurant's name to where they are travelling to.  In return, we will display a list of restaurants within the city or zip code or restaurant's name entered by the user.  Within the list of restaurants, user can click on any one of them to list the details of the specific restaurant.<br>
**Error handling:**
- If city or zip code returns no restaurants, we pop up a modal letting users know that no search results came back.
- Filter out non-alpha numeric characters
- Have a modal indicating city does not exist
- Filter out blank inputs
- Restaurant does not exist - display 0 search results<br>
**A section to display your last searches:**
[Localstorage]<br>
**A section for other people also searched:**
[Firebase Data]<br>
**New technology:**
- auto complete box for inputs<br>
**Home Page:**
- Display input fields for: City, Zip code, Restaurant
- A Search button to submit
- Beautifully designed UI  :D
**List Page:**
- Return a list of resturants based on the input we get from the user
- In each restaurant cell, display restaurant's name, image
**Details Page:**
- display $ for pricing (1 - 4, 4 being most expensive)
- display the resturant's image
- address, city, state, zip, phone 
- link to reservation via opentable
- display a google map for the restaurant.
**API References:**
https://opentable.herokuapp.com/<br>
https://developers.google.com/maps/documentation/javascript/examples/map-simple

