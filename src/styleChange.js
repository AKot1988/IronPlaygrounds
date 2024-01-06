export const styleChange = () => {
  const currentTime = new Date().getHours();
  const container = document.getElementById('pageContent');

  if (currentTime >= 6 && currentTime < 21) {
    // Денинй час
    container.style.setProperty(
      'background-image',
      "url('https://firebasestorage.googleapis.com/v0/b/ironplaygrounds.appspot.com/o/playgroundPhotos%2Fpattern-honeycomb-hexagon-wallpaper-a8463d68a080ec88c03c910e0852943a.jpg?alt=media&token=c1ad0e33-0db1-4647-bc97-08c44db606ba')"
    );
  } else {
    // Нічний час
    container.style.setProperty(
      'background-image',
      "url('https://firebasestorage.googleapis.com/v0/b/ironplaygrounds.appspot.com/o/playgroundPhotos%2Fblue-purple-violet-pattern-wallpaper-68a65d680080cca8c0fcc1de8832c41a.jpg?alt=media&token=2090b9d4-1d60-4c99-ae5a-c36440c1098b')"
    );
    const root = document.documentElement;
    root.style.setProperty('--basic-decore-color', '#2900f5');
    root.style.setProperty('--secondary-decore-color', '#777777');
    root.style.setProperty('--third-decore-color', '#e5e4e2');
    root.style.setProperty('--basic-text-color', '#00ccff');
    root.style.setProperty('--secondary-text-color', '#2900f5');
    root.style.setProperty('--basic-background-blur-color', '#2900f5');
    root.style.setProperty('--shadow-color', '#e42fdb');
  }
};
