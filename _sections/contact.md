---
order: 900
name: contact
title: Contact
subtitle: Please feel free to contact us
---

<div class="row">
    <div class="col-lg-12">
        <form action="https://formspree.io/{{site.email}}" method="post">
            <div class="row">
                <div class="col-md-6">
                    <div class="control-group form-group">
                        <input type="text" class="form-control" placeholder="Your Name *" id="name" name="name" required data-validation-required-message="Please enter your name.">
                        <p class="help-block text-danger"></p>
                    </div>
                    <div class="control-group form-group">
                        <input type="email" class="form-control" placeholder="Your Email *" id="email" name="_replyto" required data-validation-required-message="Please enter your email address.">
                        <p class="help-block text-danger"></p>
                    </div>
                    <div class="control-group form-group">
                        <input type="text" class="form-control" placeholder="Your Subject *" id="subject" name="_subject" required data-validation-required-message="Please enter your subject.">
                        <p class="help-block text-danger"></p>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="control-group form-group">
                        <textarea class="form-control" placeholder="Your Message *" id="message"  name="content" required data-validation-required-message="Please enter a message."></textarea>
                        <p class="help-block text-danger"></p>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div class="col-lg-12 text-center">
                    <div id="success"></div>
                    <button type="submit" class="btn btn-xl">Send Message</button>
                </div>
            </div>
        </form>
    </div>
</div>
