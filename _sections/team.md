---
order: 800
name: team
title: Team
subtitle: We are a group of passionate indie game makers!
background: true
---

<div class="row">
    {% for member in site.members %}
    <div class="col-sm-4">
        <div class="team-member">
            <img src="/images/members/{{member.image}}" class="img-responsive img-circle" alt="{{member.name}}">
            <h4>{{ member.full-name }}</h4>
            <p class="text-muted">{{ member.position }}</p>
            <ul class="list-inline social-buttons">
                {% for network in member.social %}
                <li>
                    <a href="{{ network.url }}">
                        <i class="fa fa-{{ network.title }}"></i>
                    </a>
                </li>
                {% endfor %}
            </ul>
        </div>
    </div>
    {% endfor %}
</div>
<div class="row">
    <div class="col-lg-8 col-lg-offset-2 text-center">
        <p class="large text-muted">Special thanks to our lovely testers: Benjamin, Florian, Mika, Nicole and Paul.</p>
    </div>
</div>
