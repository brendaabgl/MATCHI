$(document).ready(function() {
    // Add hover effect for grid images
    $(".row img").hover(function() {
        $(this).css("transform", "scale(1.05)");
        $(this).css("border", "8px solid #fff");
    }, function() {
        $(this).css("transform", "scale(1)");
        $(this).css("border", "none");
    });
});

  // JavaScript for Timeline Interaction
  const timelineItems = document.querySelectorAll('.timeline-item .circle');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  const contentTitle = document.querySelector('.timeline-content h5');
  const contentDesc = document.querySelector('.timeline-content p');

  const data = [
      { year: '5000 BC', desc: 'The first use of cotton in the Indus Valley and Peru.' },
      { year: '2600 BC', desc: 'Silk weaving starts in ancient China.' },
      { year: '3000 BC', desc: 'Wool production begins in Mesopotamia.' },
      { year: '1800 AD', desc: 'The Industrial Revolution transforms textile technology.' },
      { year: '1930 AD', desc: 'Synthetic fibers like nylon and polyester are introduced.' },
  ];

  let activeIndex = 0;

  function updateTimeline() {
      timelineItems.forEach((circle, index) => {
          if (index === activeIndex) {
              circle.style.backgroundColor = '#0d6efd';
              circle.style.color = '#fff';
          } else {
              circle.style.backgroundColor = '#fff';
              circle.style.color = '#b9b9b9';
          }
      });

      contentTitle.textContent = data[activeIndex].year;
      contentDesc.textContent = data[activeIndex].desc;

      prevBtn.disabled = activeIndex === 0;
      nextBtn.disabled = activeIndex === data.length - 1;
  }

  prevBtn.addEventListener('click', () => {
      if (activeIndex > 0) {
          activeIndex--;
          updateTimeline();
      }
  });

  nextBtn.addEventListener('click', () => {
      if (activeIndex < data.length - 1) {
          activeIndex++;
          updateTimeline();
      }
  });

  updateTimeline();