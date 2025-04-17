class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story");

        this.engine.inventory = {};
        this.engine.visitedLocations = {};

        for(let location of Object.keys(this.engine.storyData.Locations))
        {
            this.engine.visitedLocations[location] = false;

            if(location.GetItem)
            {
                this.engine.inventory[location.GetItem] = false;
            }
        }
    }

    handleChoice() {
        this.engine.gotoScene(Location, this.engine.storyData.InitialLocation); // replace this text by the initial location of the story
    }
}

class Location extends Scene {
    create(key) {
        let locationData = this.engine.storyData.Locations[key]; // use `key` to get the data object for the current story location
        
        //console.log(this.engine.inventory);

        let checkItem = locationData.CheckItem && (locationData.ItemObtained || locationData.VisitedItemObtained);
        if(checkItem)
        {
            for(let item of locationData.CheckItem)
            {
                if(Array.isArray(item))
                {
                    let validArrayItem = false;
                    for(let item2 of item) {
                        if(this.engine.inventory[item2])
                        {
                            validArrayItem = true;
                        }
                    }
                    if(!validArrayItem)
                    {
                        checkItem = false;
                    }
                }
                else
                {
                    if(!this.engine.inventory[item])
                    {
                        checkItem = false;
                    }
                    // Could also be:
                    // checkItem = checkItem && this.engine.inventory[item];'
                    // Cause then you're just 
                }
            }
        }


        if(locationData.CheckItem && checkItem && locationData.ItemObtained) 
        {
            if(this.engine.visitedLocations[key] && locationData.VisitedItemObtained) 
            {
                this.engine.show(locationData.VisitedItemObtained);
            }
            else
            {
                this.engine.show(locationData.ItemObtained);
            }
        }
        else if(this.engine.visitedLocations[key] && locationData.VisitedBody) 
        {
            this.engine.show(locationData.VisitedBody);
        }
        else
        {
            this.engine.show(locationData.Body); // replace this text by the Body of the location data
        }

       

        if(locationData.GetItem)
        {
            this.engine.inventory[locationData.GetItem] = true; 
        }

        if(this.engine.visitedLocations[key] && locationData.VisitedChoices)//visited
        {
             for(let choice of locationData.VisitedChoices) { // loop over the location's Choices
                let validChoice = true;

                if(choice.HasItems)
                {
                    for(let item of choice.HasItems)
                    {
                        if(!this.engine.inventory[item])
                        {
                            validChoice = false;
                        }
                    }
                }

                if(choice.MissingItems)
                {
                    for(let item of choice.MissingItems)
                    {
                        if(this.engine.inventory[item])
                        {
                            validChoice = false; 
                        }
                    }
                }

                if(validChoice)
                {
                    this.engine.addChoice(choice.Text, choice); // use the Text of the choic
                }
                //add a useful second argument to addChoice so that the current code of handleChoice below works
            }//do visited stuff
        }
        else if(locationData.Choices) { // check if the location has any Choices
            for(let choice of locationData.Choices) { // loop over the location's Choices
                let validChoice = true;

                if(choice.HasItems)
                {
                    for(let item of choice.HasItems)
                    {
                        if(!this.engine.inventory[item])
                        {
                            validChoice = false;
                        }
                    }
                }

                if(choice.MissingItems)
                {
                    for(let item of choice.MissingItems)
                    {
                        if(this.engine.inventory[item])
                        {
                            validChoice = false; 
                        }
                    }
                }

                if(validChoice)
                {
                    this.engine.addChoice(choice.Text, choice); // use the Text of the choic
                }
                //add a useful second argument to addChoice so that the current code of handleChoice below works
            }
        } else {
            this.engine.addChoice("The end.")
        }
        this.engine.visitedLocations[key] = true;
        /*
        for(let choice of locationData.Choices)
            {
                if(choice.Item)
                {
                    this.engine.inventory[chouce.Item] = true;
                    console.log('Got item: ${choice.Item}');
                }
                this.engine.addChoice(choice.text, choice); 
            }
        */
    }

    

    handleChoice(choice) {
        if(choice) {
            this.engine.show("&gt; "+choice.Text);
            this.engine.gotoScene(Location, choice.Target);
        } else {
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show(this.engine.storyData.Credits);
    }
}

Engine.load(Start, 'myStory.json');