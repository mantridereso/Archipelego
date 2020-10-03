<?php
/**
 * Created by IntelliJ IDEA.
 * User: martin
 * Date: 25.09.15
 * Time: 14:53
 */

namespace SVB\CBS\ShippingWorldBundle\Model;


interface MessageInterface
{

    /**
     * @return MessageContentInterface
     */
    public function getContent();

    /**
     * @return ActorInterface
     */
    public function getSender();

    /**
     * @return ActorInterface
     */
    public function getRecipient();

    /**
     * @return \DateTime|null
     */
    public function getTimeSent();

    /**
     * @return \DateTime|null
     */
    public function getTimeReceived();

    /**
     * @return MessageInterface
     */
    public function getInReplyTo();

}