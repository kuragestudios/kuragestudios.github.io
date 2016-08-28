---
order: 200
name: portfolio
title: Games
subtitle: Creativity is intelligence having fun.
---

<div class="row">
    {% for game in site.games reversed %}
        <div class="col-md-4 col-sm-6 portfolio-item">
            <a href="#portfolioModal{{game.uid}}" class="portfolio-link" data-toggle="modal">
                <div class="portfolio-hover">
                    <div class="portfolio-hover-content">
                        <i class="fa fa-plus fa-3x"></i>
                    </div>
                </div>
                <img src="{{game.thumbnail}}" class="img-responsive img-centered img-rounded" alt="{{game.name}}">
            </a>
            <div class="portfolio-caption">
                <h4>{{game.title}}</h4>
                <p class="text-muted">{{game.description}}</p>
            </div>
        </div>
    {% endfor %}
</div>
