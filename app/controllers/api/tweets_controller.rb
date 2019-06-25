module Api
  class TweetsController < ApplicationController
    def index
      @tweets = Tweet.all.order(created_at: :desc)
      render 'api/tweets/index', status: :ok
    end

    def create
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)
      user = session.user
      @tweet = user.tweets.new(tweet_params)

      if @tweet.save
        #TweetMailer.notify(@tweet).deliver!
        render 'api/tweets/create', status: :created
      end
    end

    def destroy
      token = cookies.signed[:twitter_session_token]
      session = Session.find_by(token: token)

      return render json: { success: false }, status: :bad_request unless session

      user = session.user
      tweet = Tweet.find_by(id: params[:id])

      if tweet and tweet.user == user and tweet.destroy
        render json: { success: true }, status: :ok
      else
        render json: { success: false}, status: :bad_request
      end
    end

    def index_by_user
      user = User.find_by(username: params[:username])

      if user
        @tweets = user.tweets
        render 'api/tweets/index', status: :ok
      end
    end

    private

      def tweet_params
        params.require(:tweet).permit(:message, :image)
      end
  end
end
