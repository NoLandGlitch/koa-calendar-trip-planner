const { JSDOM } = require('jsdom');
const fs = require('fs');
const path = require('path');
const { expect } = require('chai');

describe('Hot Springs Road Trip Calendar', function() {
  let document;
  let window;

  before(function() {
    const htmlPath = path.join(__dirname, '../public/index.html');
    const html = fs.readFileSync(htmlPath, 'utf8');
    const dom = new JSDOM(html, {
      runScripts: 'dangerously',
      resources: 'usable',
      url: 'http://localhost:8787/'
    });
    document = dom.window.document;
    window = dom.window;
  });

  it('renders the month calendar, editor, and month controls', function() {
    expect(document.getElementById('calendar-grid')).to.not.be.null;
    expect(document.getElementById('editor')).to.not.be.null;
    expect(document.getElementById('prev-month-btn')).to.not.be.null;
    expect(document.getElementById('next-month-btn')).to.not.be.null;
  });

  it('includes the day editor fields for the selected itinerary entry', function() {
    ['date', 'kind', 'title', 'campground', 'driveMinutes', 'rigFit', 'highlights', 'notes'].forEach(id => {
      expect(document.getElementById(id), `missing ${id}`).to.not.be.null;
    });
  });

  it('loads KOA stops and the fixed Hot Springs stay into the page copy', function() {
    expect(document.body.textContent).to.include('Hot Springs fixed stay');
    expect(document.body.textContent).to.include('Hot Springs National Park KOA Holiday');
    expect(document.body.textContent).to.include('Gettysburg / Battlefield KOA Holiday');
  });

  it('shows only trip days in the active month view and can slide to the next month', function() {
    expect(document.getElementById('month-title').textContent).to.equal('August 2026');
    expect(document.querySelectorAll('.day.trip').length).to.equal(8);

    document.getElementById('next-month-btn').click();
    expect(document.getElementById('month-title').textContent).to.equal('September 2026');
    expect(document.querySelectorAll('.day.trip').length).to.equal(29);
  });

  it('lets you click a day and edit that day’s itinerary', function() {
    if (document.getElementById('month-title').textContent !== 'August 2026') {
      document.getElementById('prev-month-btn').click();
    }

    const dayButton = document.querySelector('[data-date="2026-08-24"]');
    expect(dayButton).to.not.be.null;
    dayButton.click();

    const title = document.getElementById('title');
    title.value = 'Edited road trip day';
    title.dispatchEvent(new window.Event('input', { bubbles: true }));

    expect(document.getElementById('selected-summary').textContent).to.include('Edited road trip day');
    expect(document.getElementById('calendar-grid').textContent).to.include('Edited road trip day');
  });
});
