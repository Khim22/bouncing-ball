const randomInt = (max) =>{
    return Math.floor(Math.random() * Math.floor(max))
}

export const randomcolor = () => {
    return `rgb(${randomInt(255)}, ${randomInt(255)}, ${randomInt(255)}, ${Math.random() + 0.3})`
  }


