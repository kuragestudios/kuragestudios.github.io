---
order: 100
name: news
title: News
subtitle: Don't miss our latest news!
background: true
---

<div class="row list-group">
    {% for post in site.posts %}
        <a class="list-group-item" href="{{ post.url | prepend: site.baseurl }}">
            {{ post.title }}
            <span class="badge">{{ post.date | date: "%b %-d, %Y" }}</span>
        </a>
    {% endfor %}
</div>
