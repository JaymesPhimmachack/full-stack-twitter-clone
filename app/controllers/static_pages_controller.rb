class StaticPagesController < ApplicationController
  def home
    render 'home'
  end
  def dashboard
    render 'dashboard'
  end  
end
